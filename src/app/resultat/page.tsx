import type { Metadata } from "next";
import { Resultat } from "@/components/demo/Resultat";
import { Nav } from "@/components/Nav";
import { Pied } from "@/components/sections/Pied";

export const metadata: Metadata = {
  title: "Votre résultat : Le palace d'azur",
  robots: { index: false },
};

export default function PageResultat() {
  return (
    <>
      <Nav />
      <main id="contenu" tabIndex={-1} className="resultat">
        <Resultat />
      </main>
      <Pied />
    </>
  );
}
