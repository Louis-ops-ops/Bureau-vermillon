"use client";

import Image from "next/image";
import { useRef } from "react";
import { FAQ } from "@/content/landing";
import { gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

export function Faq() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reveleTitre(ref.current!.querySelector(".faq__titre")!, ref.current!.querySelector(".faq__tete")!, "top 60%");
      mm.add(MQ.anime, () => {
        // le mur de preuves recule derrière le titre : profondeur, pas décor qui gigote
        gsap.fromTo(
          ".faq__img",
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".faq__tete", start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from(".question", {
          y: 24,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.06,
          scrollTrigger: { trigger: ".faq__liste", start: "top 82%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="faq" className="faq" aria-labelledby="faq-titre">
      <div className="faq__tete">
        <div className="faq__media">
          <Image className="faq__img" src="/img/mur-de-preuves.webp" alt="" fill sizes="100vw" />
        </div>
        <div className="wrap">
          <h2 id="faq-titre" className="titre faq__titre">
            Tes questions avant d&apos;imprimer
          </h2>
        </div>
      </div>

      <div className="wrap faq__liste">
        {FAQ.map((item) => (
          <details className="question" key={item.q}>
            <summary>
              <span>{item.q}</span>
              <span className="question__plus" aria-hidden="true" />
            </summary>
            <p className="question__rep">{item.r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
