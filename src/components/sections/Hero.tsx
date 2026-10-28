"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // L'entrée (titre ligne par ligne, tampon) est en CSS : visible dès le premier rendu.
  // Ici seulement la sortie au scroll : le key art recule moins vite que le texte,
  // ce qui donne de la profondeur et passe le relais au bandeau.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.anime, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        tl.to(".hero__media", { yPercent: 18 }, 0)
          .to(".hero__contenu", { yPercent: -18, opacity: 0.2 }, 0)
          .to(".hero__voile", { opacity: 1 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-titre">
      <div className="hero__media">
        <Image
          className="hero__img"
          src="/img/hero-v1.webp"
          alt="Bureau peint sous une lampe : un couteau planté dans une carte, des lunettes de soleil, une carte bancaire et un cendrier."
          fill
          preload
          sizes="100vw"
        />
      </div>
      <div className="hero__voile" aria-hidden="true" />

      <div className="wrap hero__contenu">
        <span className="tampon-meta tampon-meta--fort hero__tampon">1 à 6 joueurs, sans animateur</span>
        <h1 id="hero-titre" className="hero__titre">
          <span className="hero__ligne">
            <span>Imprime le dossier.</span>
          </span>
          <span className="hero__ligne hero__ligne--rouge">
            <span>Trouve le coupable.</span>
          </span>
        </h1>
        <p className="hero__sous">
          Des enquêtes illustrées à imprimer chez toi. Un achat, un dossier, une soirée pour démasquer le coupable.
        </p>
        <div className="hero__actions">
          <Link className="btn-peinture btn-peinture--large" href="/enquetes">
            Voir les enquêtes
          </Link>
          <a className="btn-tampon" href="#gratuit">
            Essayer gratuitement
          </a>
        </div>
      </div>
    </section>
  );
}
