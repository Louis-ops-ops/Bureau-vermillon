"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SUSPECTS, UNIVERS, type UniversId } from "@/content/landing";
import { Flip, gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

type Filtre = UniversId | "tous";

// seuls les univers dont les portraits existent ont un filtre (Cyberpunk et Hôtel n'en ont pas encore)
const AVEC_SUSPECTS = UNIVERS.filter((u) => SUSPECTS.some((s) => s.univers === u.id));
const FILTRES: { id: Filtre; label: string }[] = [{ id: "tous", label: "Tous" }, ...AVEC_SUSPECTS.map((u) => ({ id: u.id, label: u.nom }))];
/** premier suspect de chaque univers : il prend toute la ligne sur mobile */
const premier = Object.fromEntries(AVEC_SUSPECTS.map((u) => [u.id, SUSPECTS.find((s) => s.univers === u.id)!.id])) as Record<UniversId, string>;
const NOM_UNIVERS = Object.fromEntries(UNIVERS.map((u) => [u.id, u.nom])) as Record<UniversId, string>;

export function Suspects() {
  const ref = useRef<HTMLElement>(null);
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const etat = useRef<Flip.FlipState | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reveleTitre(ref.current!.querySelector(".suspects__titre")!);
      mm.add(MQ.anime, () => {
        gsap.from(".suspect", {
          y: 40,
          autoAlpha: 0,
          duration: 0.6,
          stagger: { each: 0.05, grid: "auto", from: "start" },
          scrollTrigger: { trigger: ".grille-suspects", start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  // Flip : on photographie la grille avant le changement, React re-rend,
  // puis on anime l'écart en transform. La grille change de colonnes sans saut.
  useGSAP(
    () => {
      if (!etat.current) return;
      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduit) {
        Flip.from(etat.current, {
          duration: 0.6,
          ease: "encre",
          scale: true,
          // dans le flux : la grille prend tout de suite sa hauteur finale, rien ne passe
          // sous la section suivante ; les portraits retirés disparaissent sans transition
          absolute: false,
          onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.15 }),
        });
      }
      etat.current = null;
    },
    { dependencies: [filtre], scope: ref },
  );

  const choisir = (f: Filtre) => {
    if (f === filtre) return;
    etat.current = Flip.getState(ref.current!.querySelectorAll(".suspect, .filtres__curseur"));
    setFiltre(f);
  };

  return (
    <section ref={ref} className="suspects" aria-labelledby="suspects-titre">
      <div className="wrap">
        <div className="suspects__haut">
          <h2 id="suspects-titre" className="titre suspects__titre">
            Ils avaient tous une raison
          </h2>
          <p className="chapo">Trois suspects par enquête, un détail chacun. Retiens-le : il compte.</p>

          <div className="filtres" role="group" aria-label="Afficher les suspects par univers">
            {FILTRES.map((f) => (
              <button
                key={f.id}
                type="button"
                className="filtre"
                aria-pressed={filtre === f.id}
                onClick={() => choisir(f.id)}
              >
                {f.label}
                {filtre === f.id && <span className="filtres__curseur" data-flip-id="curseur" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>

        <ul className={`grille-suspects${filtre === "tous" ? "" : " grille-suspects--univers"}`}>
          {SUSPECTS.map((s) => (
            <li
              key={s.id}
              className={`suspect${filtre !== "tous" && premier[filtre] === s.id ? " suspect--vedette" : ""}`}
              data-flip-id={s.id}
              data-univers={s.univers}
              hidden={filtre !== "tous" && filtre !== s.univers}
            >
              <span className="suspect__cadre">
                <Image
                  src={`/img/suspects/${s.id}.webp`}
                  alt={s.alt}
                  width={480}
                  height={600}
                  sizes="(min-width: 1100px) 15vw, (min-width: 700px) 30vw, 45vw"
                />
              </span>
              <p className="suspect__nom">{s.nom}</p>
              <p className="suspect__role">{NOM_UNIVERS[s.univers]}</p>
              <p className="suspect__indice">Détail : {s.indice}</p>
            </li>
          ))}
        </ul>
        <p className="sr-only" role="status">
          {filtre === "tous" ? "12 suspects affichés" : `3 suspects affichés, univers ${NOM_UNIVERS[filtre]}`}
        </p>
      </div>
    </section>
  );
}
