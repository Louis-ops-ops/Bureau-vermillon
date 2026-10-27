"use client";

import { useRef } from "react";
import { BANDEAU } from "@/content/landing";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Le seul bandeau de la page. Il n'avance que quand on fait défiler : pas de contenu
 * qui bouge tout seul (WCAG 2.2.2), et le mouvement répond au geste du lecteur.
 */
export function Bandeau() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.anime, () => {
        gsap.fromTo(
          ".bandeau__piste",
          { xPercent: 0 },
          {
            xPercent: -33.333,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.4 },
          },
        );
      });
    },
    { scope: ref },
  );

  const groupe = (cle: string) => (
    <div className="bandeau__groupe" key={cle}>
      {BANDEAU.map((mot) => (
        <span className="bandeau__item" key={mot}>
          <span className="bandeau__mot">{mot}</span>
          <span className="bandeau__sep" />
        </span>
      ))}
    </div>
  );

  return (
    <section ref={ref} className="bandeau" aria-label="En bref">
      <ul className="sr-only">
        {BANDEAU.map((mot) => (
          <li key={mot}>{mot}</li>
        ))}
      </ul>
      <div className="bandeau__piste" aria-hidden="true">
        {["a", "b", "c"].map(groupe)}
      </div>
    </section>
  );
}
