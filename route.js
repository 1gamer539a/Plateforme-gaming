import { NextResponse } from "next/server";
import supabaseAdmin from "../../../../lib/supabaseAdmin";

/*
  URL à configurer dans le dashboard Sebpay comme "webhook URL" pour
  les confirmations de paiement. Sebpay appelle cette route lui-même
  quand un paiement de recharge est confirmé — jamais le navigateur du
  client. Vérifier la signature de la requête (header ou secret
  partagé) dès que la doc technique Sebpay est disponible ; le bloc
  ci-dessous est un placeholder à sécuriser avant mise en prod.
*/
export async function POST(req) {
  try {
    const payload = await req.json();

    // TODO une fois la doc Sebpay disponible : vérifier
    // req.headers.get("x-sebpay-signature") contre SEBPAY_WEBHOOK_SECRET
    // avant de faire confiance au payload.

    const referenceInterne = payload.reference; // = transactions_wallet.id envoyé à l'initiation
    const statutSebpay = payload.status; // ex: "success" | "failed"

    if (!referenceInterne) {
      return NextResponse.json({ error: "reference manquante" }, { status: 400 });
    }

    const { data: transaction } = await supabaseAdmin
      .from("transactions_wallet")
      .select("id, user_id, montant, statut, type")
      .eq("id", referenceInterne)
      .single();

    if (!transaction || transaction.type !== "recharge" || transaction.statut !== "en_attente") {
      // Déjà traité, ou transaction inconnue — on répond 200 pour éviter
      // que Sebpay ne réessaie indéfiniment sur un cas déjà géré.
      return NextResponse.json({ ok: true });
    }

    if (statutSebpay === "success") {
      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("solde")
        .eq("user_id", transaction.user_id)
        .single();

      const soldeActuel = Number(wallet?.solde || 0);

      if (wallet) {
        await supabaseAdmin
          .from("wallets")
          .update({ solde: soldeActuel + Number(transaction.montant), date_maj: new Date().toISOString() })
          .eq("user_id", transaction.user_id);
      } else {
        await supabaseAdmin.from("wallets").insert({ user_id: transaction.user_id, solde: Number(transaction.montant) });
      }

      await supabaseAdmin.from("transactions_wallet").update({ statut: "reussi" }).eq("id", transaction.id);
    } else {
      await supabaseAdmin.from("transactions_wallet").update({ statut: "echoue" }).eq("id", transaction.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
