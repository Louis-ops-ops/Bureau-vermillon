"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MARQUE } from "@/content/landing";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePanier } from "@/lib/panier";

const LIENS = [
  { href: "/enquetes", label: "Enquêtes" },
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/#faq", label: "FAQ" },
];

/** Lien panier : le compteur est remonté à chaque changement pour rejouer le coup de tampon. */
function LienPanier({ onClick }: { onClick?: () => void }) {
  const { articles } = usePanier();
  const n = articles?.length ?? 0;
  return (
    <Link
      className="nav__panier"
      href="/panier"
      onClick={onClick}
      aria-label={n ? `Panier, ${n} enquête${n > 1 ? "s" : ""}` : "Panier, vide"}
    >
      Panier
      {n > 0 && (
        <span className="nav__compte" key={n} aria-hidden="true">
          {n}
        </span>
      )}
    </Link>
  );
}

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [ouvert, setOuvert] = useState(false);

  // Fond plein dès qu'on quitte le haut de page ; la barre s'efface quand on descend
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
        const glisse = gsap.quickTo(nav, "yPercent", { duration: 0.16, ease: "power1.out" });
        // la classe sur <html> laisse les barres collées sous la nav (filtres de la boutique) suivre
        const cacher = (oui: boolean) => {
          glisse(oui ? -100 : 0);
          document.documentElement.classList.toggle("nav-cachee", oui);
        };
        ScrollTrigger.create({
          start: 400,
          end: "max",
          onUpdate: (self) => cacher(self.direction === 1 && !nav.contains(document.activeElement)),
          onLeaveBack: () => cacher(false),
        });
        return () => document.documentElement.classList.remove("nav-cachee");
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
        <Link className="marque" href="/" aria-label={`${MARQUE}, accueil`}>
          <span className="marque__barre" aria-hidden="true" />
          {MARQUE}
        </Link>

        <nav aria-label="Principale" className="nav__liens">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <LienPanier />

        <Link className="btn-tampon nav__cta" href="/#gratuit">
          Essayer gratuitement
        </Link>

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
            <Link key={l.href} href={l.href} onClick={() => setOuvert(false)}>
              {l.label}
            </Link>
          ))}
          <Link className="btn-tampon" href="/#gratuit" onClick={() => setOuvert(false)}>
            Essayer gratuitement
          </Link>
        </nav>
      </div>
    </header>
  );
}
