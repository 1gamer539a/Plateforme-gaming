"use client";

import React, { useState } from "react";
import BoutonIAFlottant from "./BoutonIAFlottant";
import IAAssistant from "./IAAssistant";

const THEMES = {
  sombre: { background: "#0A0E1A", surface: "#131A2C", accentPrimary: "#4F7CFF", accentSecondary: "#B24BF3", textPrimary: "#F2F4FF", textMuted: "#8A93B8", border: "#232C47" },
  clair: { background: "#FFFFFF", surface: "#FFF4EC", accentPrimary: "#FF6A00", accentSecondary: "#FF8C3D", textPrimary: "#1A1A1A", textMuted: "#767676", border: "#FFE0C2" },
};

/*
  A utiliser comme layout racine (ex: app/layout.jsx en Next.js App
  Router). Toutes les pages du site ({children}) s'affichent normalement,
  et le bouton IA flottant + le panneau IA en plein écran restent
  disponibles au-dessus, sur CHAQUE page, sans avoir à les remonter
  page par page.
*/
export default function LayoutRacine({ children }) {
  const [iaOuverte, setIaOuverte] = useState(false);
  const COLORS = THEMES.sombre;

  return (
    <div className="relative">
      {children}

      {!iaOuverte && (
        <BoutonIAFlottant COLORS={COLORS} onOpen={() => setIaOuverte(true)} />
      )}

      {iaOuverte && (
        <div className="fixed inset-0 z-[60]">
          <IAAssistant onFermer={() => setIaOuverte(false)} />
        </div>
      )}
    </div>
  );
}
