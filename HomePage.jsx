"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu, X, Search, Zap, Gamepad2, Shirt, Tv, Store,
  Sparkles, Trophy, GraduationCap, Home, LayoutGrid,
  ShoppingCart, MessageSquare, User, ChevronRight, ChevronDown,
  Sun, Moon
} from "lucide-react";
import { supabase } from "../lib/supabase";

const THEMES = {
  sombre: {
    background: "#0A0E1A",
    surface: "#131A2C",
    accentPrimary: "#4F7CFF",
    accentSecondary: "#B24BF3",
    textPrimary: "#F2F4FF",
    textMuted: "#8A93B8",
    border: "#232C47",
  },
  clair: {
    background: "#FFFFFF",
    surface: "#FFF4EC",
    accentPrimary: "#FF6A00",
    accentSecondary: "#FF8C3D",
    textPrimary: "#1A1A1A",
    textMuted: "#767676",
    border: "#FFE0C2",
  },
};

const MENU_SECTIONS = [
  { label: "Recharges de jeu", icon: Zap, href: "/categories" },
  { label: "Comptes & Abonnements", icon: Tv, href: "/categories" },
  { label: "Accessoires PC & PlayStation", icon: Gamepad2, href: "/categories" },
  { label: "Vêtements & Guildes", icon: Shirt, href: "/categories" },
  { label: "Le Marché", icon: Store, href: "/marche" },
  { label: "Vendeurs partenaires", icon: Store, href: "/vendre" },
  { label: "IA Assistant", icon: Sparkles, href: "/ia" },
  { label: "Tournois", icon: Trophy, href: "/tournois" },
  { label: "Formation", icon: GraduationCap, href: "/formation/createurs" },
];

const QUICK_ACCESS = [
  { label: "Le Marché", icon: Store, href: "/marche" },
  { label: "Accessoires", icon: Gamepad2, href: "/categories" },
  { label: "Vêtements", icon: Shirt, href: "/categories" },
  { label: "Abonnements", icon: Tv, href: "/categories" },
  { label: "IA Assistant", icon: Sparkles, href: "/ia" },
  { label: "Tournois", icon: Trophy, href: "/tournois" },
  { label: "Formation", icon: GraduationCap, href: "/formation/createurs" },
  { label: "Marketing Digital", icon: Tv, href: "/marketing-digital" },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Accueil");
  const [theme, setTheme] = useState("sombre");
  const COLORS = THEMES[theme];
  const [produitsTendances, setProduitsTendances] = useState([]);

  useEffect(() => {
    const charger = async () => {
      const { data, error } = await supabase
        .from("produits")
        .select("id, nom, prix_base, type")
        .eq("statut_validation", "valide")
        .order("date_creation", { ascending: false })
        .limit(6);

      if (!error && data) {
        const LABELS_TYPE = {
          recharge_jeu: "Recharge",
          accessoire: "Accessoire",
          vetement: "Vêtement",
          abonnement_service: "Abonnement",
        };
        setProduitsTendances(
          data.map((p) => ({
            id: p.id,
            titre: p.nom,
            prix: `${Number(p.prix_base).toLocaleString()} FCFA`,
            tag: LABELS_TYPE[p.type] || p.type,
          }))
        );
      }
    };
    charger();
  }, []);

  return (
    <div
      style={{ background: COLORS.background, color: COLORS.textPrimary, minHeight: "100vh" }}
      className="font-sans flex flex-col"
    >
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: COLORS.background, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <button onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
          <Menu size={24} color={COLORS.textPrimary} />
        </button>
        <span className="text-sm tracking-widest uppercase" style={{ color: COLORS.textMuted }}>
          Plateforme Gaming
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "sombre" ? "clair" : "sombre")}
            aria-label="Changer de thème"
          >
            {theme === "sombre" ? (
              <Sun size={20} color={COLORS.accentSecondary} />
            ) : (
              <Moon size={20} color={COLORS.accentSecondary} />
            )}
          </button>
          <Link href="/recherche" aria-label="Rechercher">
            <Search size={22} color={COLORS.accentPrimary} />
          </Link>
        </div>
      </header>

      {/* MENU HAMBURGER — panneau latéral */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="w-4/5 max-w-xs h-full overflow-y-auto p-5"
            style={{ background: COLORS.background, borderRight: `1px solid ${COLORS.border}` }}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
                <X size={24} color={COLORS.textPrimary} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {MENU_SECTIONS.map(({ label, icon: Icon, badge, href }) => (
                <Link
                  href={href}
                  key={label}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-2 rounded-lg text-left"
                  style={{ borderBottom: `1px solid ${COLORS.border}` }}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} color={COLORS.accentPrimary} />
                    <span style={{ color: COLORS.textPrimary }}>{label}</span>
                  </span>
                  {badge ? (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: COLORS.accentSecondary, color: COLORS.background }}
                    >
                      {badge}
                    </span>
                  ) : (
                    <ChevronRight size={16} color={COLORS.textMuted} />
                  )}
                </Link>
              ))}
              <div className="mt-4 pt-4 text-sm" style={{ color: COLORS.textMuted, borderTop: `1px solid ${COLORS.border}` }}>
                Langue | Devise
              </div>
            </nav>
          </div>
          <button
            className="flex-1"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer"
          />
        </div>
      )}

      {/* CONTENU */}
      <main className="flex-1 pt-16 pb-20 px-4 max-w-md mx-auto w-full">
        {/* HERO */}
        <section
          className="mt-4 rounded-2xl p-5"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        >
          <h1 className="text-3xl font-extrabold leading-tight uppercase tracking-tight">
            Tout le gaming,
            <br />
            <span style={{ color: COLORS.accentPrimary }}>un seul écosystème</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: COLORS.textMuted }}>
            Recharges · Accessoires · Vêtements · IA · Marketplace
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              href="/marche"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: COLORS.accentPrimary, color: COLORS.background }}
            >
              Découvrir la boutique
            </Link>
            <Link
              href="/vendre"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ border: `1px solid ${COLORS.accentPrimary}`, color: COLORS.accentPrimary }}
            >
              Devenir vendeur
            </Link>
          </div>
        </section>

        {/* GRILLE ACCES RAPIDE */}
        <section className="grid grid-cols-4 gap-3 mt-5">
          {QUICK_ACCESS.map(({ label, icon: Icon, badge, href }) => (
            <Link
              href={href}
              key={label}
              className="flex flex-col items-center justify-center gap-2 rounded-xl py-4 relative"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
            >
              {badge && (
                <span
                  className="absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{ background: COLORS.accentSecondary, color: COLORS.background }}
                >
                  {badge}
                </span>
              )}
              <Icon size={22} color={COLORS.accentPrimary} />
              <span className="text-xs text-center" style={{ color: COLORS.textPrimary }}>
                {label}
              </span>
            </Link>
          ))}
        </section>

        {/* PRODUITS TENDANCES */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ color: COLORS.accentPrimary }}>
              Produits tendances
            </h2>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {produitsTendances.length === 0 && (
              <p className="text-xs" style={{ color: COLORS.textMuted }}>Aucun produit pour l'instant.</p>
            )}
            {produitsTendances.map((p) => (
              <Link
                href={`/produit/${p.id}`}
                key={p.id}
                className="min-w-[140px] rounded-xl p-3 flex-shrink-0 block"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
              >
                <div
                  className="w-full h-20 rounded-lg mb-2"
                  style={{ background: COLORS.background }}
                />
                <span className="text-[10px] uppercase" style={{ color: COLORS.accentSecondary }}>
                  {p.tag}
                </span>
                <p className="text-sm font-semibold leading-tight mt-1">{p.titre}</p>
                <p className="text-sm font-bold mt-1" style={{ color: COLORS.accentPrimary }}>
                  {p.prix}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* BANDEAU VENDEUR */}
        <section
          className="mt-6 rounded-2xl p-5"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        >
          <h3 className="text-lg font-bold">Rejoignez l'écosystème</h3>
          <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
            Devenez vendeur agréé, lancez votre boutique gaming.
          </p>
          <button
            className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: COLORS.accentPrimary, color: COLORS.background }}
          >
            Créer mon compte vendeur
          </button>
        </section>
      </main>

      {/* BOTTOM NAV */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-around py-2"
        style={{ background: COLORS.background, borderTop: `1px solid ${COLORS.border}` }}
      >
        {[
          { label: "Accueil", icon: Home, href: "/" },
          { label: "Catégories", icon: LayoutGrid, href: "/categories" },
          { label: "Panier", icon: ShoppingCart, href: "/panier" },
          { label: "Messages", icon: MessageSquare, href: "/messages" },
          { label: "Compte", icon: User, href: "/compte" },
        ].map(({ label, icon: Icon, href }) => {
          const active = activeTab === label;
          return (
            <Link
              href={href}
              key={label}
              onClick={() => setActiveTab(label)}
              className="flex flex-col items-center gap-1"
            >
              <Icon size={20} color={active ? COLORS.accentPrimary : COLORS.textMuted} />
              <span
                className="text-[10px]"
                style={{ color: active ? COLORS.accentPrimary : COLORS.textMuted }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
