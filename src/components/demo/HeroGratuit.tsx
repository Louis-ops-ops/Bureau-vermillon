"use client";

import Image from "next/image";
import { useRef } from "react";
import { policesDossier } from "@/lib/demo/polices";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { ChoixDemo } from "./ChoixDemo";

/**
 * Hero de /gratuit, au niveau de celui de la landing : key art Hôtel plein cadre, titre géant
 * révélé ligne par ligne, et une vraie pièce du dossier posée sur la table (la note de Castellane, P02).
 */
export function HeroGratuit() {
  const ref = useRef<HTMLElement>(null);

  // L'entrée est en CSS (visible dès le premier rendu). Au scroll : le key art recule, la note
  // monte plus vite que le texte, trois plans qui se séparent avant de passer à la suite.
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ.anime, () => {
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
          .to(".demo-hero__media", { yPercent: 16 }, 0)
          .to(".demo-hero__contenu", { yPercent: -14, opacity: 0.25 }, 0)
          .to(".demo-hero__note", { yPercent: -40 }, 0)
          .to(".demo-hero__voile", { opacity: 1 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="demo-hero" data-univers="hotel" aria-labelledby="gratuit-titre">
      <div className="demo-hero__media">
        <Image className="demo-hero__img" src="/img/key-art/key-art-hotel.webp" alt="" fill preload sizes="100vw" />
      </div>
      <div className="demo-hero__voile" aria-hidden="true" />

      <div className="wrap demo-hero__contenu">
        <div className="demo-hero__tete">
          <span className="tampon-meta tampon-meta--fort demo-hero__tampon">Gratuit</span>
          <span className="demo-hero__surtitre">Enquête gratuite · Dossier HOT-00</span>
        </div>
        <h1 id="gratuit-titre" className="demo-hero__titre">
          <span className="demo-hero__ligne">
            <span>Le palace</span>
          </span>
          <span className="demo-hero__ligne demo-hero__ligne--accent">
            <span>d&apos;azur</span>
          </span>
        </h1>
        <p className="demo-hero__accroche">
          Le coffre du plus beau palace de la Croisette a été vidé en une nuit. Le voleur ne cherchait qu&apos;une chose, et il porte un nom qui
          n&apos;est pas le sien.
        </p>
        <ul className="demo-hero__tampons" aria-label="La démo en bref">
          <li className="tampon-meta">
            <b>1–2</b> joueurs
          </li>
          <li className="tampon-meta">
            <b>20</b> min
          </li>
          <li className="tampon-meta">Démo</li>
          <li className="tampon-meta">
            À l&apos;écran ou <b>22 p.</b> à imprimer
          </li>
        </ul>
        <ChoixDemo />
      </div>

      {/* Une pièce de l'acte 1, telle qu'imprimée : la note manuscrite du directeur sur le registre des dépôts */}
      <figure className={`demo-hero__note ${policesDossier}`}>
        <figcaption className="demo-hero__note-tete">
          <span>Grand Hôtel Azuréa — Réception</span>
          <span>P02</span>
        </figcaption>
        <blockquote className="demo-hero__note-texte">
          <p>14/8 — 7 h. Coffre ouvert en ma présence et celle de Mlle Arnaud. Dépôts 57, 58, 59, 61 et 63 disparus — le pli de M. Delaroche avec.</p>
          <p className="demo-hero__note-signe">— H. Castellane</p>
        </blockquote>
      </figure>
    </section>
  );
}
