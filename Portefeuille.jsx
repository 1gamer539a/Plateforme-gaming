"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Sun, Moon, Wallet, Plus, ArrowDownToLine, Send,
  ShieldAlert, Clock, CheckCircle2, XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const THEMES = {
  sombre: { background: "#0A0E1A", surface: "#131A2C", accentPrimary: "#4F7CFF", accentSecondary: "#B24BF3", textPrimary: "#F2F4FF", textMuted: "#8A93B8", border: "#232C47" },
  clair: { background: "#FFFFFF", surface: "#FFF4EC", accentPrimary: "#FF6A00", accentSecondary: "#FF8C3D", textPrimary: "#1A1A1A", textMuted: "#767676", border: "#FFE0C2" },
};

const SEUIL_CNI = 15000;

export default function Portefeuille() {
  const router = useRouter();
  const [theme, setTheme] = useState("sombre");
  const COLORS = THEMES[theme];

  const [solde, setSolde] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pieceVerifiee, setPieceVerifiee] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [panneau, setPanneau] = useState(null); // "recharge" | "retrait" | "transfert" | null
  const [montant, setMontant] = useState("");
  const [numero, setNumero] = useState("");
  const [moyen, setMoyen] = useState("mtn_mobile_money");
  const MAP_OPERATEUR = { mtn_mobile_money: "MTN Mobile Money", airtel_money: "Airtel Money" };
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(null);

  const charger = async () => {
    setChargement(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setChargement(false); return; }

    const { data: profil } = await supabase.from("users").select("piece_identite_verifiee").eq("id", user.id).single();
    if (profil) setPieceVerifiee(profil.piece_identite_verifiee);

    const { data: wallet } = await supabase.from("wallets").select("solde").eq("user_id", user.id).single();
    setSolde(Number(wallet?.solde || 0));

    const { data: txs } = await supabase
      .from("transactions_wallet")
      .select("id, type, montant, statut, date_creation")
      .eq("user_id", user.id)
      .order("date_creation", { ascending: false })
      .limit(20);
    if (txs) setTransactions(txs);

    setChargement(false);
  };

  useEffect(() => { charger(); }, []);

  const appelApi = async (endpoint, body) => {
    const { data: { session } } = await supabase.auth.getSession();
    const reponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    return { ok: reponse.ok, data: await reponse.json() };
  };

  const soumettre = async () => {
    setErreur(null);
    setSucces(null);
    if (!montant) return;
    setEnCours(true);

    try {
      if (panneau === "recharge") {
        const { ok, data } = await appelApi("/api/wallet/recharger", { montant, numeroClient: numero, operateur: MAP_OPERATEUR[moyen] });
        if (!ok) throw new Error(data.error || "Échec de la recharge.");
        setSucces(data.lienPaiement ? "Redirection vers le paiement..." : "Recharge initiée.");
        if (data.lienPaiement) window.location.href = data.lienPaiement;
      }

      if (panneau === "retrait") {
        if (parseFloat(montant) >= SEUIL_CNI && !pieceVerifiee) {
          setErreur(`Vérification d'identité requise pour les retraits à partir de ${SEUIL_CNI.toLocaleString()} FCFA.`);
          setEnCours(false);
          return;
        }
        const { ok, data } = await appelApi("/api/wallet/retirer", { montant, moyen, numeroDestinataire: numero, operateur: MAP_OPERATEUR[moyen] });
        if (!ok) {
          if (data.error === "verification_requise") {
            setErreur(data.message);
            setTimeout(() => router.push("/verification-identite"), 1500);
            setEnCours(false);
            return;
          }
          throw new Error(data.message || data.error || "Échec du retrait.");
        }
        setSucces("Retrait envoyé avec succès.");
        charger();
      }

      if (panneau === "transfert") {
        const { ok, data } = await appelApi("/api/wallet/transferer", { montant, telephoneDestinataire: numero });
        if (!ok) throw new Error(data.error || "Échec du transfert.");
        setSucces(`Transfert envoyé à ${data.destinataire}.`);
        charger();
      }

      setMontant("");
      setNumero("");
    } catch (e) {
      setErreur(e.message);
    } finally {
      setEnCours(false);
    }
  };

  const LABELS_TYPE = {
    recharge: { label: "Recharge", icon: Plus, signe: "+" },
    retrait: { label: "Retrait", icon: ArrowDownToLine, signe: "−" },
    transfert_envoye: { label: "Transfert envoyé", icon: Send, signe: "−" },
    transfert_recu: { label: "Transfert reçu", icon: Send, signe: "+" },
    paiement_commande: { label: "Paiement commande", icon: ArrowDownToLine, signe: "−" },
    ajustement_admin: { label: "Ajustement équipe", icon: ShieldAlert, signe: "±" },
  };

  return (
    <div style={{ background: COLORS.background, minHeight: "100vh", color: COLORS.textPrimary }}>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: COLORS.background, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <button onClick={() => router.back()} aria-label="Retour"><ArrowLeft size={22} color={COLORS.textPrimary} /></button>
        <span className="text-sm font-semibold flex items-center gap-1"><Wallet size={15} color={COLORS.accentPrimary} /> Mon portefeuille</span>
        <button onClick={() => setTheme(theme === "sombre" ? "clair" : "sombre")} aria-label="Changer de thème">
          {theme === "sombre" ? <Sun size={20} color={COLORS.accentSecondary} /> : <Moon size={20} color={COLORS.accentSecondary} />}
        </button>
      </header>

      <main className="max-w-md mx-auto w-full px-4 pt-20 pb-10 flex flex-col gap-4">
        {/* Solde */}
        <div className="rounded-2xl p-5 text-center" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>Solde disponible</p>
          <p className="text-3xl font-extrabold mt-1" style={{ color: COLORS.accentPrimary }}>
            {chargement ? "—" : solde.toLocaleString()} FCFA
          </p>
          {!pieceVerifiee && (
            <p className="text-[11px] mt-2 flex items-center justify-center gap-1" style={{ color: COLORS.textMuted }}>
              <ShieldAlert size={12} /> Identité non vérifiée — retraits limités à {SEUIL_CNI.toLocaleString()} FCFA
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "recharge", label: "Recharger", icon: Plus },
            { id: "retrait", label: "Retirer", icon: ArrowDownToLine },
            { id: "transfert", label: "Transférer", icon: Send },
          ].map((a) => (
            <button
              key={a.id}
              onClick={() => { setPanneau(a.id); setErreur(null); setSucces(null); }}
              className="rounded-xl py-3 flex flex-col items-center gap-1"
              style={{
                background: panneau === a.id ? COLORS.accentPrimary : COLORS.surface,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <a.icon size={18} color={panneau === a.id ? COLORS.background : COLORS.accentPrimary} />
              <span className="text-[11px] font-semibold" style={{ color: panneau === a.id ? COLORS.background : COLORS.textPrimary }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Panneau d'action */}
        {panneau && (
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
            <input
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              type="number"
              placeholder="Montant (FCFA)"
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
            />

            {panneau === "recharge" && (
              <>
                <div className="flex gap-2">
                  {["mtn_mobile_money", "airtel_money"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMoyen(m)}
                      className="flex-1 rounded-lg py-2 text-[10px] font-semibold uppercase"
                      style={{ background: moyen === m ? COLORS.accentPrimary : COLORS.background, color: moyen === m ? COLORS.background : COLORS.textMuted, border: `1px solid ${COLORS.border}` }}
                    >
                      {MAP_OPERATEUR[m]}
                    </button>
                  ))}
                </div>
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ton numéro Mobile Money"
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
                />
              </>
            )}

            {panneau === "retrait" && (
              <>
                <div className="flex gap-2">
                  {["mtn_mobile_money", "airtel_money"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMoyen(m)}
                      className="flex-1 rounded-lg py-2 text-[10px] font-semibold uppercase"
                      style={{ background: moyen === m ? COLORS.accentPrimary : COLORS.background, color: moyen === m ? COLORS.background : COLORS.textMuted, border: `1px solid ${COLORS.border}` }}
                    >
                      {m.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Numéro destinataire"
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
                />
                {parseFloat(montant) >= SEUIL_CNI && !pieceVerifiee && (
                  <button
                    onClick={() => router.push("/verification-identite")}
                    className="text-[11px] flex items-center gap-1 text-left"
                    style={{ color: "#B23A2E" }}
                  >
                    <ShieldAlert size={12} /> Vérification d'identité requise pour ce montant — appuie ici
                  </button>
                )}
              </>
            )}

            {panneau === "transfert" && (
              <input
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Numéro du destinataire sur la plateforme"
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
              />
            )}

            {erreur && <p className="text-xs" style={{ color: "#B23A2E" }}>{erreur}</p>}
            {succes && <p className="text-xs" style={{ color: "#3A8A5C" }}>{succes}</p>}

            <button
              onClick={soumettre}
              disabled={enCours || !montant}
              className="rounded-xl py-3 font-semibold"
              style={{
                background: montant ? COLORS.accentPrimary : COLORS.border,
                color: montant ? COLORS.background : COLORS.textMuted,
              }}
            >
              {enCours ? "Traitement..." : "Confirmer"}
            </button>
          </div>
        )}

        {/* Historique */}
        <p className="text-xs font-bold uppercase tracking-wide mt-2" style={{ color: COLORS.accentPrimary }}>Historique</p>
        {transactions.length === 0 && <p className="text-xs" style={{ color: COLORS.textMuted }}>Aucune transaction pour l'instant.</p>}
        {transactions.map((t) => {
          const info = LABELS_TYPE[t.type] || { label: t.type, icon: Wallet, signe: "" };
          return (
            <div key={t.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: COLORS.background }}>
                <info.icon size={15} color={COLORS.accentPrimary} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold">{info.label}</p>
                <p className="text-[10px]" style={{ color: COLORS.textMuted }}>{new Date(t.date_creation).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold" style={{ color: COLORS.accentPrimary }}>{info.signe}{Number(t.montant).toLocaleString()} FCFA</span>
                <span className="text-[10px] flex items-center gap-1" style={{ color: t.statut === "reussi" ? "#3A8A5C" : t.statut === "echoue" ? "#B23A2E" : COLORS.textMuted }}>
                  {t.statut === "reussi" && <CheckCircle2 size={10} />}
                  {t.statut === "echoue" && <XCircle size={10} />}
                  {t.statut === "en_attente" && <Clock size={10} />}
                  {t.statut}
                </span>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
