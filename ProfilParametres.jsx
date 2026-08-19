"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Sun, Moon, User, Phone, Mail, LogOut, ChevronRight,
  Bell, Globe, ShieldCheck, Store, Sparkles, HelpCircle, Wallet
} from "lucide-react";
import { useRouter } from "next/navigation";

const THEMES = {
  sombre: { background: "#0A0E1A", surface: "#131A2C", accentPrimary: "#4F7CFF", accentSecondary: "#B24BF3", textPrimary: "#F2F4FF", textMuted: "#8A93B8", border: "#232C47" },
  clair: { background: "#FFFFFF", surface: "#FFF4EC", accentPrimary: "#FF6A00", accentSecondary: "#FF8C3D", textPrimary: "#1A1A1A", textMuted: "#767676", border: "#FFE0C2" },
};

const UTILISATEUR = {
  nom: "Livaï M.",
  telephone: "+242 06 780 39 87",
  email: "livai@example.com",
  role: "vendeur", // client | vendeur
  forfaitIA: "free",
};

export default function ProfilParametres() {
  const router = useRouter();
  const [theme, setTheme] = useState("sombre");
  const COLORS = THEMES[theme];
  const [notifsActives, setNotifsActives] = useState(true);

  const SECTIONS = [
    {
      titre: "Compte",
      items: [
        { label: "Informations personnelles", icon: User, href: "/compte" },
        { label: "Mon portefeuille", icon: Wallet, href: "/portefeuille" },
        { label: "Mes commandes", icon: Store, href: "/commandes" },
        { label: "Mes favoris", icon: Bell, href: "/favoris" },
        { label: "Langue & Devise", icon: Globe, href: "/compte" },
      ],
    },
    {
      titre: "Boutique",
      items: [
        UTILISATEUR.role === "vendeur"
          ? { label: "Mon dashboard vendeur", icon: Store, href: "/dashboard" }
          : { label: "Devenir vendeur", icon: Store, href: "/vendre" },
      ],
    },
    {
      titre: "IA",
      items: [
        { label: `Forfait IA — ${UTILISATEUR.forfaitIA === "premium" ? "Premium" : "Free"}`, icon: Sparkles, href: "/ia" },
      ],
    },
    {
      titre: "Support",
      items: [
        { label: "Nous contacter", icon: HelpCircle, href: "/contact" },
        { label: "Politique de livraison & retours", icon: ShieldCheck, href: "/contact" },
      ],
    },
  ];

  return (
    <div style={{ background: COLORS.background, minHeight: "100vh", color: COLORS.textPrimary }}>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: COLORS.background, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <button onClick={() => router.back()} aria-label="Retour"><ArrowLeft size={22} color={COLORS.textPrimary} /></button>
        <span className="text-sm font-semibold">Mon compte</span>
        <button onClick={() => setTheme(theme === "sombre" ? "clair" : "sombre")} aria-label="Changer de thème">
          {theme === "sombre" ? <Sun size={20} color={COLORS.accentSecondary} /> : <Moon size={20} color={COLORS.accentSecondary} />}
        </button>
      </header>

      <main className="max-w-md mx-auto w-full px-4 pt-20 pb-10">
        {/* En-tête profil */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
            <User size={26} color={COLORS.accentPrimary} />
          </div>
          <div>
            <p className="font-bold text-base">{UTILISATEUR.nom}</p>
            <p className="text-xs flex items-center gap-1" style={{ color: COLORS.textMuted }}>
              <Phone size={11} /> {UTILISATEUR.telephone}
            </p>
            <p className="text-xs flex items-center gap-1" style={{ color: COLORS.textMuted }}>
              <Mail size={11} /> {UTILISATEUR.email}
            </p>
          </div>
        </div>

        {/* Toggle notifications */}
        <div className="rounded-xl p-3 flex items-center justify-between mb-6" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-2">
            <Bell size={16} color={COLORS.accentSecondary} />
            <span className="text-sm">Notifications push</span>
          </div>
          <button
            onClick={() => setNotifsActives(!notifsActives)}
            className="w-10 h-6 rounded-full relative"
            style={{ background: notifsActives ? COLORS.accentPrimary : COLORS.border }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-1 transition-all"
              style={{ background: COLORS.background, left: notifsActives ? 22 : 4 }}
            />
          </button>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.titre} className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.accentPrimary }}>
              {section.titre}
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
              {section.items.map((item, i) => (
                <Link
                  href={item.href || "/compte"}
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-3"
                  style={{
                    background: COLORS.surface,
                    borderBottom: i < section.items.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  }}
                >
                  <item.icon size={16} color={COLORS.accentSecondary} />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  <ChevronRight size={15} color={COLORS.textMuted} />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <button
          className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2 mt-4"
          style={{ border: `1px solid #B23A2E`, color: "#B23A2E" }}
        >
          <LogOut size={16} /> Se déconnecter
        </button>
      </main>
    </div>
  );
}
