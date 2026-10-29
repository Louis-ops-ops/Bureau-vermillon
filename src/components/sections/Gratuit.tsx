"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

/** Section « Essayer gratuitement » : présente la démo HOT-00 et mène à /gratuit. */
export function Gratuit() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reveleTitre(ref.current!.querySelector(".gratuit__titre")!);
      // Narration : l'enveloppe se pose sur la table, puis le sceau se brise et le dossier sort.
      mm.add(MQ.anime, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".enveloppe", start: "top 80%", once: true } })
          .from(".enveloppe", { y: 120, rotation: 6, autoAlpha: 0, duration: 0.85 })
          .to(".sceau__moitie--g", { xPercent: -40, yPercent: 30, rotation: -28, duration: 0.3, ease: "power2.out" }, "+=0.15")
          .to(".sceau__moitie--d", { xPercent: 40, yPercent: 40, rotation: 24, duration: 0.3, ease: "power2.out" }, "<")
          .to(".sceau__moitie", { autoAlpha: 0, duration: 0.2 }, "-=0.05")
          .to(".enveloppe__rabat", { scaleY: -1, duration: 0.35, ease: "power1.inOut" }, "-=0.15")
          .set(".enveloppe__rabat", { zIndex: 0 })
          .fromTo(".enveloppe__lettre", { yPercent: 0 }, { yPercent: -48, duration: 0.6 }, "-=0.05");
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="gratuit" className="gratuit" aria-labelledby="gratuit-titre">
      <div className="wrap gratuit__grille">
        <div className="gratuit__texte">
          <p className="gratuit__surtitre">Enquête gratuite · Dossier HOT-00</p>
          <h2 id="gratuit-titre" className="titre gratuit__titre">
            Le palace d&apos;azur
          </h2>
          <p className="chapo">
            Le coffre du plus beau palace de la Croisette a été vidé en une nuit. Le voleur ne cherchait qu&apos;une chose, et il porte un nom qui
            n&apos;est pas le sien.
          </p>
          <ul className="gratuit__tampons" aria-label="La démo en bref">
            <li className="tampon-meta">
              <b>1–2</b> joueurs
            </li>
            <li className="tampon-meta">
              <b>20</b> min
            </li>
            <li className="tampon-meta">À l&apos;écran ou à imprimer</li>
          </ul>
          <div className="gratuit__cta">
            <Link className="btn-peinture" href="/gratuit">
              Essayer gratuitement
            </Link>
          </div>
        </div>

        <div className="enveloppe" aria-hidden="true">
          <div className="enveloppe__lettre">
            <p className="enveloppe__ref">Dossier HOT-00</p>
            <p className="enveloppe__nom">Le palace d&apos;azur</p>
            <span className="feuille__lignes" />
          </div>
          <span className="enveloppe__corps" />
          <span className="enveloppe__rabat" />
          <span className="sceau">
            <span className="sceau__moitie sceau__moitie--g" />
            <span className="sceau__moitie sceau__moitie--d" />
          </span>
          <span className="enveloppe__tampon">Gratuit</span>
        </div>
      </div>
    </section>
  );
}
