import type { Metadata } from "next";
import { Disclaimer } from "@/components/demo/Disclaimer";
import { HeroGratuit } from "@/components/demo/HeroGratuit";
import { Nav } from "@/components/Nav";
import { Pied } from "@/components/sections/Pied";

export const metadata: Metadata = {
  title: "Le palace d'azur : une enquête gratuite, à jouer en ligne ou à imprimer",
  description:
    "Le coffre du plus beau palace de la Croisette a été vidé en une nuit. Une enquête courte et gratuite : 20 minutes, 1 à 2 joueurs, à l'écran ou en 22 pages à imprimer.",
};

const ETAPES = [
  { titre: "Lisez les pièces", texte: "Trouvez la réponse dans les pièces." },
  { titre: "Calculez le numéro du paragraphe", texte: "Convertissez-la en nombre avec la règle de la question, puis ajoutez la base." },
  { titre: "Ouvrez le registre", texte: "Ouvrez ce paragraphe dans le registre, et lui seul." },
];

export default function Gratuit() {
  return (
    <>
      <Nav />
      <main id="contenu" tabIndex={-1} className="demo-page">
        <HeroGratuit />

        <section className="demo-etapes" aria-labelledby="etapes-titre">
          <div className="wrap">
            <Disclaimer className="demo-etapes__disclaimer" />
            <h2 id="etapes-titre" className="demo-etapes__titre">
              Comment ça se joue en ligne
            </h2>
            <ol className="demo-etapes__liste">
              {ETAPES.map((e, i) => (
                <li key={e.titre} className="demo-etapes__item">
                  <span className="demo-etapes__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="demo-etapes__nom">{e.titre}</h3>
                  <p className="demo-etapes__texte">{e.texte}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Pied />
    </>
  );
}
