"use client";

import Image from "next/image";
import { useRef } from "react";
import { PAGES } from "@/content/landing";
import { gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

const ETAPES = [
  {
    verbe: "Télécharge",
    texte: "Le PDF arrive juste après le paiement, à l'écran et par e-mail. Le lien reste valable.",
    tampon: <span className="tampon-meta tampon-meta--laiton">Téléchargement immédiat</span>,
  },
  {
    verbe: "Imprime",
    texte: "Des feuilles A4, en noir et blanc si tu veux. Le guide dit quoi glisser sous enveloppe.",
    tampon: (
      <span className="tampon-meta">
        <b>{PAGES}</b> pages
      </span>
    ),
  },
  {
    verbe: "Enquête",
    texte: "Sans animateur : vous comparez vos grilles, puis le code du dossier révèle la solution.",
    tampon: (
      <span className="tampon-meta">
        <b>1 à 6</b> joueurs
      </span>
    ),
  },
];

export function Etapes() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reveleTitre(ref.current!.querySelector(".etapes__titre")!);

      mm.add(MQ.anime, () => {
        // Chaque verbe se remplit d'encre pendant qu'il traverse l'écran : l'étape en cours
        // est la seule pleine, la hiérarchie suit la lecture.
        gsap.utils.toArray<HTMLElement>(".etape").forEach((etape) => {
          const st = { trigger: etape, start: "top 78%", end: "top 38%", scrub: 0.5 };
          gsap.fromTo(etape.querySelector(".etape__masque"), { xPercent: -101 }, { xPercent: 0, ease: "none", scrollTrigger: st });
          gsap.fromTo(etape.querySelector(".etape__plein"), { xPercent: 101 }, { xPercent: 0, ease: "none", scrollTrigger: st });
          gsap.from(etape.querySelector(".etape__corps"), {
            y: 24,
            autoAlpha: 0,
            duration: 0.7,
            scrollTrigger: { trigger: etape, start: "top 62%", once: true },
          });
        });

        // La table s'ouvre en grand : c'est la soirée qu'on vend, elle arrive en dernier.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".etapes__table", start: "top bottom", end: "center center", scrub: true },
        });
        tl.fromTo(".etapes__table", { scale: 0.74 }, { scale: 1 }, 0).fromTo(
          ".etapes__table img",
          { scale: 1.25 },
          { scale: 1.02 },
          0,
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="comment" className="etapes" aria-labelledby="etapes-titre">
      <div className="wrap">
        <h2 id="etapes-titre" className="titre etapes__titre">
          Trois gestes, une soirée
        </h2>

        <ol className="etapes__liste">
          {ETAPES.map((e) => (
            <li className="etape" key={e.verbe}>
              <h3 className="etape__verbe">
                <span className="etape__contour">{e.verbe}</span>
                <span className="etape__masque" aria-hidden="true">
                  <span className="etape__plein">{e.verbe}</span>
                </span>
              </h3>
              <div className="etape__corps">
                <p>{e.texte}</p>
                {e.tampon}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <figure className="etapes__table">
        <Image
          src="/img/enquete-table-joueurs.webp"
          alt="Six joueurs penchés sur des documents étalés autour d'une table, sous une lampe suspendue."
          fill
          sizes="100vw"
        />
      </figure>
    </section>
  );
}
