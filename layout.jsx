import "./globals.css";
import LayoutClient from "../components/LayoutClient";

export const metadata = {
  title: "Plateforme Gaming",
  description: "Marketplace gaming — accessoires, vêtements, recharges, IA et plus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
