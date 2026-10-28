import type { Metadata } from "next";
import { Catalogue } from "@/components/boutique/Catalogue";
import { Nav } from "@/components/Nav";
import { Pied } from "@/components/sections/Pied";

export const metadata: Metadata = {
  title: "Les enquêtes à imprimer : Policier, Narcos, Cyberpunk, Viking, Hôtel, Chevalier",
  description:
    "Toutes les enquêtes à imprimer, rangées par univers. Un dossier PDF, de 1 à 6 joueurs, sans animateur, téléchargement immédiat.",
};

export default function Enquetes() {
  return (
    <>
      <Nav />
      <main id="contenu" tabIndex={-1} className="boutique">
        <header className="wrap boutique__tete">
          <h1 className="boutique__titre">Les enquêtes</h1>
          <p className="chapo">
            Rangées par univers. Chaque dossier se télécharge tout de suite et s&apos;imprime chez toi.
          </p>
        </header>
        <Catalogue />
      </main>
      <Pied />
    </>
  );
}
