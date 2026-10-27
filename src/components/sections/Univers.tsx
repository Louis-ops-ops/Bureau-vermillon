"use client";

import Image from "next/image";
import { useRef } from "react";
import { UNIVERS } from "@/content/landing";
import { gsap, MQ, reveleTitre, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Univers() {
  const ref = useRef<HTMLElement>(null);
  // hors de la section : un parent épinglé (transformé) décalerait un enfant en position fixe
  const etiquetteRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const section = ref.current!;
      reveleTitre(section.querySelector(".univers__titre")!);

      // Bureau : défilement horizontal épinglé. On traverse les quatre époques une par une,
      // comme on feuillette des chemises ; le key art glisse un peu moins vite que sa carte
      // (parallaxe légère, sans zoom : les peintures restent nettes).
      mm.add(MQ.bureau, () => {
        const piste = section.querySelector<HTMLElement>(".univers__piste")!;
        const distance = () => piste.scrollWidth - window.innerWidth;

        const pan = gsap.to(piste, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.utils.toArray<HTMLElement>(".univers__carte").forEach((carte) => {
          gsap.fromTo(
            carte.querySelector(".carte-univers__fond"),
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: carte, containerAnimation: pan, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(carte.querySelectorAll(".univers__epoque, .carte-univers__titre, .univers__pitch"), {
            y: 30,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 0.6,
            scrollTrigger: { trigger: carte, containerAnimation: pan, start: "left 70%", once: true },
          });
        });

        // Étiquette qui suit le pointeur sur les cartes : le curseur système reste là,
        // l'étiquette dit seulement ce que fait le clic.
        const etiquette = etiquetteRef.current!;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const xTo = gsap.quickTo(etiquette, "x", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(etiquette, "y", { duration: 0.35, ease: "power3.out" });
        const bouge = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };
        const montre = (e: PointerEvent) => {
          gsap.set(etiquette, { x: e.clientX, y: e.clientY });
          gsap.to(etiquette, { autoAlpha: 1, scale: 1, duration: 0.15, ease: "power1.out" });
        };
        const cache = () => gsap.to(etiquette, { autoAlpha: 0, scale: 0.8, duration: 0.14, ease: "power1.out" });
        const cartes = gsap.utils.toArray<HTMLElement>(".univers__carte");
        cartes.forEach((c) => {
          c.addEventListener("pointerenter", montre);
          c.addEventListener("pointerleave", cache);
        });
        section.addEventListener("pointermove", bouge);
        // l'étiquette ne doit pas rester en l'air si on quitte la section en défilant
        const st = ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onLeave: cache, onLeaveBack: cache });

        return () => {
          cartes.forEach((c) => {
            c.removeEventListener("pointerenter", montre);
            c.removeEventListener("pointerleave", cache);
          });
          section.removeEventListener("pointermove", bouge);
          st.kill();
        };
      });

      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>(".univers__carte").forEach((carte) => {
          gsap.from(carte, { y: 60, autoAlpha: 0, duration: 0.7, scrollTrigger: { trigger: carte, start: "top 90%", once: true } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <>
    <section ref={ref} id="univers" className="univers" aria-labelledby="univers-titre">
      <div className="univers__piste">
        <div className="univers__intro">
          <h2 id="univers-titre" className="titre univers__titre">
            Quatre époques, quatre affaires
          </h2>
          <p className="chapo">
            Chaque univers a sa palette, ses suspects et son dossier. La règle ne change pas : un coupable, et il est dans la pièce.
          </p>
        </div>

        {UNIVERS.map((u) => (
          <a key={u.id} className="carte-univers univers__carte" href={`/univers/${u.id}`} data-univers={u.id}>
            <Image
              className="carte-univers__fond"
              src={`/img/key-art/key-art-${u.id}.webp`}
              alt=""
              fill
              sizes="(min-width: 1024px) 64vw, 100vw"
              style={{ objectPosition: u.cadrage }}
            />
            <span className="carte-univers__contenu">
              <span className="carte-univers__trait" />
              <span className="univers__epoque">{u.epoque}</span>
              <h3 className="carte-univers__titre">{u.nom}</h3>
              <span className="univers__pitch">{u.pitch}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
    <span ref={etiquetteRef} className="curseur-etiquette" aria-hidden="true">
      Ouvrir le dossier
    </span>
    </>
  );
}
