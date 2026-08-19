"use client";

import React, { useState } from "react";
import {
  ArrowLeft, Sun, Moon, ShieldCheck, Store, Upload, Clock,
  CheckCircle2, MapPin, Phone, User, Building2, FileText, CreditCard
} from "lucide-react";
import { useRouter } from "next/navigation";

const THEMES = {
  sombre: { background: "#0A0E1A", surface: "#131A2C", accentPrimary: "#4F7CFF", accentSecondary: "#B24BF3", textPrimary: "#F2F4FF", textMuted: "#8A93B8", border: "#232C47" },
  clair: { background: "#FFFFFF", surface: "#FFF4EC", accentPrimary: "#FF6A00", accentSecondary: "#FF8C3D", textPrimary: "#1A1A1A", textMuted: "#767676", border: "#FFE0C2" },
};

export default function DevenirVendeur() {
  const router = useRouter();
  const [theme, setTheme] = useState("sombre");
  const COLORS = THEMES[theme];

  const [niveau, setNiveau] = useState(null);
  const [envoye, setEnvoye] = useState(false);

  const [nomMarche, setNomMarche] = useState("");
  const [telMarche, setTelMarche] = useState("");
  const [villeMarche, setVilleMarche] = useState("");

  const [nomBoutique, setNomBoutique] = useState("");
  const [pays, setPays] = useState("CG");
  const [sousDomaine, setSousDomaine] = useState("");
  const [categories, setCategories] = useState([]);
  const [prestataire, setPrestataire] = useState("sebpay");
  const [documentIdentite, setDocumentIdentite] = useState(null);
  const [documentActivite, setDocumentActivite] = useState(null);

  const CATEGORIES = ["Accessoires", "Vêtements", "Recharges de jeu", "Abonnements"];
const CATEGORIES_PHYSIQUES = ["Accessoires", "Vêtements"];
const PAYS_DISPONIBLES = [
  { code: "CG", nom: "Congo Brazzaville" },
  { code: "CM", nom: "Cameroun" },
  { code: "CI", nom: "Côte d'Ivoire" },
  { code: "SN", nom: "Sénégal" },
  { code: "BJ", nom: "Bénin" },
  { code: "TG", nom: "Togo" },
  { code: "BF", nom: "Burkina Faso" },
  { code: "ML", nom: "Mali" },
  { code: "NE", nom: "Niger" },
  { code: "GA", nom: "Gabon" },
  { code: "CD", nom: "R.D. Congo" },
  { code: "TD", nom: "Tchad" },
  { code: "GN", nom: "Guinée" },
  { code: "GW", nom: "Guinée-Bissau" },
  { code: "MR", nom: "Mauritanie" },
  { code: "RW", nom: "Rwanda" },
  { code: "CF", nom: "Centrafrique" },
  { code: "GQ", nom: "Guinée Équatoriale" },
  { code: "KE", nom: "Kenya" },
];
  const toggleCategorie = (c) =>
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  if (envoye) {
    return (
      <div style={{ background: COLORS.background, minHeight: "100vh", color: COLORS.textPrimary }} className="flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.accentPrimary}` }}>
          {niveau === "revendeur_officiel" ? <Clock size={22} color={COLORS.accentPrimary} /> : <CheckCircle2 size={22} color={COLORS.accentPrimary} />}
        </div>
        <p className="font-bold text-lg">
          {niveau === "revendeur_officiel" ? "Demande envoyée" : "Ton profil marché est prêt !"}
        </p>
        <p className="text-sm mt-2" style={{ color: COLORS.textMuted }}>
          {niveau === "revendeur_officiel"
            ? "Ta demande de revendeur officiel passe par une vérification rigoureuse. Réponse sous 72h."
            : "Tu peux commencer à publier des articles à vendre dès maintenant."}
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.background, minHeight: "100vh", color: COLORS.textPrimary }}>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: COLORS.background, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <button onClick={() => niveau && setNiveau(null)} aria-label="Retour">
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </button>
        <span className="text-sm font-semibold">Vendre sur la plateforme</span>
        <button onClick={() => setTheme(theme === "sombre" ? "clair" : "sombre")} aria-label="Changer de thème">
          {theme === "sombre" ? <Sun size={20} color={COLORS.accentSecondary} /> : <Moon size={20} color={COLORS.accentSecondary} />}
        </button>
      </header>

      <main className="max-w-md mx-auto w-full px-4 pt-20 pb-10 flex flex-col gap-4">
        {!niveau && (
          <div className="flex flex-col gap-3">
            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              Tu peux changer de formule plus tard si besoin.
            </p>
            <button
              onClick={() => setNiveau("vendeur_simple")}
              className="rounded-2xl p-4 text-left"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Store size={20} color={COLORS.accentPrimary} />
                <span className="text-base font-bold">Le Marché — vends vite fait</span>
              </div>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>
                Comme un marché local, mais en ligne. Nom, téléphone, ville — c'est tout.
                Vends des vêtements, objets, accessoires... Publication quasi instantanée.
              </p>
            </button>
            <button
              onClick={() => setNiveau("revendeur_officiel")}
              className="rounded-2xl p-4 text-left"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={20} color={COLORS.accentPrimary} />
                <span className="text-base font-bold">Revendeur officiel</span>
              </div>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>
                Partenariat sérieux : boutique dédiée, clients apportés par la plateforme,
                mise en avant. Vérification rigoureuse de ton identité et de ton activité.
              </p>
            </button>
          </div>
        )}

        {niveau === "vendeur_simple" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl px-3 py-2 text-xs" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>
              Ton profil sera visible publiquement (nom, ville, articles). Biens physiques uniquement — pas de recharges ni d'abonnements.
            </div>

            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <div>
                <label className="text-xs font-semibold flex items-center gap-1 mb-1"><User size={12} /> Nom</label>
                <input
                  value={nomMarche}
                  onChange={(e) => setNomMarche(e.target.value)}
                  placeholder="Ton nom ou pseudo public"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold flex items-center gap-1 mb-1"><Phone size={12} /> Téléphone</label>
                <input
                  value={telMarche}
                  onChange={(e) => setTelMarche(e.target.value)}
                  placeholder="+242 06 000 00 00"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold flex items-center gap-1 mb-1"><MapPin size={12} /> Ville</label>
                <input
                  value={villeMarche}
                  onChange={(e) => setVilleMarche(e.target.value)}
                  placeholder="Brazzaville, Pointe-Noire..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
                />
              </div>
            </div>

            <button
              onClick={() => setEnvoye(true)}
              disabled={!nomMarche || !telMarche || !villeMarche}
              className="w-full rounded-xl py-3 font-semibold"
              style={{
                background: nomMarche && telMarche && villeMarche ? COLORS.accentPrimary : COLORS.border,
                color: nomMarche && telMarche && villeMarche ? COLORS.background : COLORS.textMuted,
              }}
            >
              Commencer à vendre
            </button>
          </div>
        )}

        {niveau === "revendeur_officiel" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl px-3 py-2 text-xs" style={{ background: COLORS.surface, border: `1px solid ${COLORS.accentPrimary}`, color: COLORS.textMuted }}>
              Procédure de vérification rigoureuse — identité, activité réelle et document justificatif obligatoires.
            </div>

            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <div>
                <label className="text-xs font-semibold flex items-center gap-1 mb-1"><Building2 size={12} /> Nom de la boutique</label>
                <input
                  value={nomBoutique}
                  onChange={(e) => setNomBoutique(e.target.value)}
                  placeholder="Ex: Kivu Gaming Store"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Pays</label>
                <select
                  value={pays}
                  onChange={(e) => setPays(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }}
                >
                  {PAYS_DISPONIBLES.map((p) => (
                    <option key={p.code} value={p.code}>{p.nom}</option>
                  ))}
                </select>
                {pays !== "CG" && (
                  <p className="text-[11px] mt-1" style={{ color: COLORS.textMuted }}>
                    Hors Congo, seuls les produits digitaux (recharges, abonnements) sont vendables.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Sous-domaine souhaité</label>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                  <input
                    value={sousDomaine}
                    onChange={(e) => setSousDomaine(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="kivu-gaming"
                    className="flex-1 px-3 py-2 text-sm outline-none"
                    style={{ background: COLORS.background, color: COLORS.textPrimary }}
                  />
                  <span className="text-xs px-2" style={{ color: COLORS.textMuted, background: COLORS.background }}>.plateforme.com</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <label className="text-xs font-semibold block mb-2">Catégories vendues</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter((c) => pays === "CG" || !CATEGORIES_PHYSIQUES.includes(c)).map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCategorie(c)}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{
                      background: categories.includes(c) ? COLORS.accentPrimary : COLORS.background,
                      color: categories.includes(c) ? COLORS.background : COLORS.textPrimary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <label className="text-xs font-semibold block mb-2 flex items-center gap-1"><CreditCard size={13} /> Prestataire de paiement</label>
              <div className="flex gap-2">
                {["sebpay", "cinetpay", "autre"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrestataire(p)}
                    className="flex-1 rounded-lg py-2 text-xs font-semibold uppercase"
                    style={{
                      background: prestataire === p ? COLORS.accentPrimary : COLORS.background,
                      color: prestataire === p ? COLORS.background : COLORS.textPrimary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <label className="text-xs font-semibold block mb-1 flex items-center gap-1"><FileText size={13} /> Pièce d'identité</label>
              <button
                onClick={() => setDocumentIdentite("id.jpg")}
                className="w-full rounded-lg p-3 flex flex-col items-center justify-center text-xs mb-3"
                style={{ border: `1px dashed ${COLORS.border}`, color: COLORS.textMuted }}
              >
                <Upload size={18} color={COLORS.accentSecondary} className="mb-1" />
                {documentIdentite ? "✓ Document ajouté" : "Importer une pièce d'identité"}
              </button>

              <label className="text-xs font-semibold block mb-1">Preuve d'activité (registre, patente...)</label>
              <button
                onClick={() => setDocumentActivite("activite.jpg")}
                className="w-full rounded-lg p-3 flex flex-col items-center justify-center text-xs"
                style={{ border: `1px dashed ${COLORS.border}`, color: COLORS.textMuted }}
              >
                <Upload size={18} color={COLORS.accentSecondary} className="mb-1" />
                {documentActivite ? "✓ Document ajouté" : "Importer un justificatif"}
              </button>
            </div>

            <button
              onClick={() => setEnvoye(true)}
              disabled={!nomBoutique || !sousDomaine || categories.length === 0 || !documentIdentite || !documentActivite}
              className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
              style={{
                background: nomBoutique && sousDomaine && categories.length > 0 && documentIdentite && documentActivite ? COLORS.accentPrimary : COLORS.border,
                color: nomBoutique && sousDomaine && categories.length > 0 && documentIdentite && documentActivite ? COLORS.background : COLORS.textMuted,
              }}
            >
              <CheckCircle2 size={16} /> Envoyer ma demande
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
