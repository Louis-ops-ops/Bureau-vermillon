"use client";

import { useEffect, useRef, useState } from "react";
import { MARQUE } from "@/content/landing";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const LIENS = [
  { href: "#univers", label: "Enquêtes" },
  { href: "#comment", label: "Comment ça marche" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [ouvert, setOuvert] = useState(false);

  // Fond plein dès qu'on quitte le haut du hero ; la barre s'efface quand on descend
  // et revient dès qu'on remonte : la lecture garde tout l'écran, la nav reste à un geste.
  useGSAP(
    () => {
      const nav = ref.current!;
      const mm = gsap.matchMedia();
      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => nav.classList.toggle("nav--pleine", self.isActive),
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cache = gsap.quickTo(nav, "yPercent", { duration: 0.16, ease: "power1.out" });
        ScrollTrigger.create({
          start: 400,
          end: "max",
          onUpdate: (self) => cache(self.direction === 1 && !nav.contains(document.activeElement) ? -100 : 0),
          onLeaveBack: () => cache(0),
        });
      });
    },
    { scope: ref },
  );

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("keydown", fermer);
    return () => document.removeEventListener("keydown", fermer);
  }, [ouvert]);

  return (
    <header ref={ref} className={`nav${ouvert ? " nav--ouverte" : ""}`}>
      <div className="wrap nav__in">
        <a className="marque" href="#contenu" aria-label={`${MARQUE}, retour en haut`}>
          <span className="marque__barre" aria-hidden="true" />
          {MARQUE}
        </a>

        <nav aria-label="Principale" className="nav__liens">
          {LIENS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="btn-tampon nav__cta" href="#gratuit">
          Essayer gratuitement
        </a>

        <button
          type="button"
          className="nav__menu"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          onClick={() => setOuvert((o) => !o)}
        >
          {ouvert ? "Fermer" : "Menu"}
        </button>
      </div>

      <div id="menu-mobile" className="nav__tiroir" hidden={!ouvert}>
        <nav aria-label="Menu mobile" className="wrap">
          {LIENS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOuvert(false)}>
              {l.label}
            </a>
          ))}
          <a className="btn-tampon" href="#gratuit" onClick={() => setOuvert(false)}>
            Essayer gratuitement
          </a>
        </nav>
      </div>
    </header>
  );
}
