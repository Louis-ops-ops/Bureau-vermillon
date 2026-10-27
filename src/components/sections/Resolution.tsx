"use client";

import Image from "next/image";
import { useRef } from "react";
import { TAUX_RESOLUTION } from "@/content/landing";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const TOUR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Un rouleau par chiffre. Le dernier a deux tours de bande pour faire un tour complet de plus. */
function rouleaux(n: number) {
  const digits = String(n).split("").map(Number);
  return digits.map((d, i) => {
    const dernier = i === digits.length - 1;
    const bande = dernier ? [...TOUR, ...TOUR] : TOUR;
    return {
      bande,
      repos: -(d / bande.length) * 100, // position affichée sans animation
      arrivee: -((dernier ? TOUR.length + d : d) / bande.length) * 100,
      fantome: d,
    };
  });
}

export function Resolution() {
  const ref = useRef<HTMLElement>(null);
  const liste = rouleaux(TAUX_RESOLUTION);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Le compteur tourne comme un compteur mécanique avant de tomber sur le chiffre :
      // un résultat qu'on relève, pas un slogan posé.
      mm.add(MQ.anime, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".resolution__chiffre", start: "top 85%", once: true } });
        gsap.utils.toArray<HTMLElement>(".rouleau__bande").forEach((bande, i) => {
          // y: 0 annule la translation inline (position de repos) que GSAP additionnerait sinon
          tl.fromTo(bande, { y: 0, yPercent: 0 }, { yPercent: liste[i].arrivee, duration: 1.2 + i * 0.35, ease: "encre" }, 0);
        });
        gsap.fromTo(
          ".resolution__media img",
          { yPercent: -5 },
          { yPercent: 5, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="resolution" aria-labelledby="resolution-titre">
      <div className="resolution__media">
        <Image
          src="/img/suspect-dans-l-ombre.webp"
          alt="Salle d'interrogatoire rouge : un homme seul à une table sous une lampe, observé depuis l'ombre."
          fill
          sizes="100vw"
        />
      </div>

      <div className="wrap resolution__bas">
        <p className="resolution__chiffre" aria-hidden="true">
          {liste.map((r, i) => (
            <span className="rouleau" key={i}>
              <span className="rouleau__fantome">{r.fantome}</span>
              <span className="rouleau__bande" style={{ transform: `translateY(${r.repos}%)` }}>
                {r.bande.map((c, j) => (
                  <span key={j}>{c}</span>
                ))}
              </span>
            </span>
          ))}
          <span className="resolution__pourcent">%</span>
        </p>

        <div className="resolution__texte">
          <h2 id="resolution-titre" className="resolution__phrase">
            <span className="sr-only">{TAUX_RESOLUTION} % </span>des enquêteurs trouvent le coupable.
          </h2>
          <p>Les autres accusent quelqu&apos;un d&apos;autre. Teste ton flair avant d&apos;acheter.</p>
          <a className="lien-stylo" href="#gratuit">
            Essayer gratuitement
          </a>
        </div>
      </div>
    </section>
  );
}
