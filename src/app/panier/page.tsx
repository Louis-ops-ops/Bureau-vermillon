import type { Metadata } from "next";
import { Panier } from "@/components/boutique/Panier";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Ton panier",
  robots: { index: false },
};

export default function PagePanier() {
  return (
    <>
      <Nav />
      <main id="contenu" tabIndex={-1} className="wrap panier">
        <h1 id="panier-titre" tabIndex={-1} className="panier__titre">
          Ton panier
        </h1>
        <Panier />
      </main>
    </>
  );
}
