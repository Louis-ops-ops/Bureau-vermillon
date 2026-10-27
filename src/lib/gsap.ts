"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, useGSAP);
  // La courbe du système pour les mouvements de scroll : sèche, jamais élastique.
  CustomEase.create("encre", ".2,.7,.2,1");
  gsap.defaults({ ease: "encre" });
}

/** Conditions de gsap.matchMedia partagées par toutes les sections. */
export const MQ = {
  anime: "(prefers-reduced-motion: no-preference)",
  bureau: "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
  mobile: "(prefers-reduced-motion: no-preference) and (max-width: 1023.98px)",
} as const;

/**
 * Révélation d'un titre ligne par ligne derrière un masque. Les masques reçoivent
 * la classe `ligne-mask` (padding vertical en CSS pour ne pas couper les accents).
 */
export function reveleTitre(el: Element, declencheur: Element = el, debut = "top 82%") {
  // matchMedia : rien n'est découpé ni caché quand le mouvement est réduit
  gsap.matchMedia().add(MQ.anime, () => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "ligne",
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.lines, {
          yPercent: 135, // au-delà de 100 : les accents (É, Ê) ne dépassent pas du masque
          duration: 0.8,
          stagger: 0.09,
          scrollTrigger: { trigger: declencheur, start: debut, once: true },
        }),
    });
  });
}

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
