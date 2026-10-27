import type { Metadata, Viewport } from "next";
import { Anton, Roboto_Mono, Special_Elite } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--police-anton", display: "swap" });
const robotoMono = Roboto_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--police-mono",
  display: "swap",
});
const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--police-document",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enquêtes à imprimer chez soi, de 1 à 6 joueurs",
  description:
    "Des enquêtes illustrées à imprimer : un dossier, des suspects, une solution protégée par un code. Policier, Narcos, Viking, Chevalier. Téléchargement immédiat.",
};

export const viewport: Viewport = {
  themeColor: "#12100e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${anton.variable} ${robotoMono.variable} ${specialElite.variable}`}>
      <body>
        <a className="evitement" href="#contenu">
          Aller au contenu
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
        <SmoothScroll />
      </body>
    </html>
  );
}
