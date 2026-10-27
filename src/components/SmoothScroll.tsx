"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Lenis piloté par le ticker GSAP : un seul rAF pour le scroll et ScrollTrigger. */
export function SmoothScroll() {
  // Toute variation de hauteur (filtre des suspects, FAQ dépliée, formulaire envoyé,
  // police chargée) décale les déclencheurs placés plus bas : on les recalcule.
  useEffect(() => {
    let derniere = document.body.scrollHeight;
    let minuteur: number | undefined;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(minuteur);
      minuteur = window.setTimeout(() => {
        if (Math.abs(document.body.scrollHeight - derniere) < 2) return;
        ScrollTrigger.refresh();
        derniere = document.body.scrollHeight;
      }, 150);
    });
    ro.observe(document.body);
    return () => {
      window.clearTimeout(minuteur);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -72 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Les images et les polices changent la hauteur des sections épinglées.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
