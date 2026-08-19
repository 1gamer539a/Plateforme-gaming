"use client";

import React, { useState } from "react";
import { ArrowLeft, Sun, Moon, Phone, Lock, User, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const THEMES = {
  sombre: { background: "#0A0E1A", surface: "#131A2C", accentPrimary: "#4F7CFF", accentSecondary: "#B24BF3", textPrimary: "#F2F4FF", textMuted: "#8A93B8", border: "#232C47" },
  clair: { background: "#FFFFFF", surface: "#FFF4EC", accentPrimary: "#FF6A00", accentSecondary: "#FF8C3D", textPrimary: "#1A1A1A", textMuted: "#767676", border: "#FFE0C2" },
};

/*
  Un seul compte (table `users`) sert pour tout : achats, vente,
  chat, IA premium, etc. Pas de compte séparé par univers.
*/
export default function AuthCompte() {
  const router = useRouter();
  const [theme, setTheme] = useState("sombre");
  const COLORS = THEMES[theme];
  const [mode, setMode] = useState("connexion"); // connexion | inscription
  const [voirMdp, setVoirMdp] = useState(false);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [captchaCoche, setCaptchaCoche] = useState(false);

  return (
    <div style={{ background: COLORS.background, minHeight: "100vh", color: COLORS.textPrimary }}>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: COLORS.background, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <button onClick={() => router.back()} aria-label="Retour"><ArrowLeft size={22} color={COLORS.textPrimary} /></button>
        <span className="text-sm font-semibold">{mode === "connexion" ? "Connexion" : "Créer un compte"}</span>
        <button onClick={() => setTheme(theme === "sombre" ? "clair" : "sombre")} aria-label="Changer de thème">
          {theme === "sombre" ? <Sun size={20} color={COLORS.accentSecondary} /> : <Moon size={20} color={COLORS.accentSecondary} />}
        </button>
      </header>

      <main className="max-w-md mx-auto w-full px-4 pt-24 pb-10">
        <p className="text-xl font-extrabold mb-1">
          {mode === "connexion" ? "Content de te revoir 👋" : "Rejoins l'écosystème"}
        </p>
        <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>
          Un seul compte pour acheter, vendre, discuter et utiliser l'IA.
        </p>

        <div className="flex flex-col gap-3">
          {/* Connexion sociale */}
          <button
            className="w-full rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2 text-sm"
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary }}
          >
            Continuer avec Google
          </button>
          <button
            className="w-full rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2 text-sm"
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary }}
          >
            Continuer avec Facebook
          </button>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px" style={{ background: COLORS.border }} />
            <span className="text-[11px]" style={{ color: COLORS.textMuted }}>ou</span>
            <div className="flex-1 h-px" style={{ background: COLORS.border }} />
          </div>

          {mode === "inscription" && (
            <div>
              <label className="text-xs font-semibold block mb-1">Nom complet</label>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                <User size={16} color={COLORS.textMuted} />
                <input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ton nom"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: COLORS.textPrimary }}
                />
              </div>
            </div>
          )}

          {mode === "inscription" && (
            <div>
              <label className="text-xs font-semibold block mb-1">Email</label>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                <Mail size={16} color={COLORS.textMuted} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: COLORS.textPrimary }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold block mb-1">Téléphone</label>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <Phone size={16} color={COLORS.textMuted} />
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+242 06 000 00 00"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: COLORS.textPrimary }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Mot de passe</label>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <Lock size={16} color={COLORS.textMuted} />
              <input
                type={voirMdp ? "text" : "password"}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: COLORS.textPrimary }}
              />
              <button onClick={() => setVoirMdp(!voirMdp)} aria-label="Afficher le mot de passe">
                {voirMdp ? <EyeOff size={16} color={COLORS.textMuted} /> : <Eye size={16} color={COLORS.textMuted} />}
              </button>
            </div>
          </div>

          {mode === "connexion" && (
            <button className="text-xs text-right" style={{ color: COLORS.accentSecondary }}>
              Mot de passe oublié ?
            </button>
          )}

          {/* Vérification anti-robot */}
          <button
            onClick={() => setCaptchaCoche(!captchaCoche)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5"
            style={{ background: COLORS.surface, border: `1px solid ${captchaCoche ? COLORS.accentPrimary : COLORS.border}` }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: captchaCoche ? COLORS.accentPrimary : COLORS.background, border: `1px solid ${COLORS.border}` }}
            >
              {captchaCoche && <ShieldCheck size={13} color={COLORS.background} />}
            </div>
            <span className="text-xs" style={{ color: COLORS.textPrimary }}>Je ne suis pas un robot</span>
          </button>

          <button
            disabled={!captchaCoche}
            onClick={() => router.push(mode === "connexion" ? "/" : "/securite/pin")}
            className="w-full rounded-xl py-3 font-semibold mt-2"
            style={{
              background: captchaCoche ? COLORS.accentPrimary : COLORS.border,
              color: captchaCoche ? COLORS.background : COLORS.textMuted,
            }}
          >
            {mode === "connexion" ? "Se connecter" : "Créer mon compte"}
          </button>
        </div>

        <p className="text-xs text-center mt-6" style={{ color: COLORS.textMuted }}>
          {mode === "connexion" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <button
            onClick={() => setMode(mode === "connexion" ? "inscription" : "connexion")}
            className="font-semibold"
            style={{ color: COLORS.accentPrimary }}
          >
            {mode === "connexion" ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </main>
    </div>
  );
}
