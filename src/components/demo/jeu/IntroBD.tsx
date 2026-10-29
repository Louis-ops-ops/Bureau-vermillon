"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CASES } from "@/content/demo/hot-00/dossier";
import { dispatch } from "@/lib/demo/store";

/** P00 : les 4 cases une par une. Bouton « Suivant », flèches du clavier ou glissé du doigt. */
export function IntroBD() {
  const [i, setI] = useState(0);
  const depart = useRef<{ x: number; y: number } | null>(null);
  const titre = useRef<HTMLHeadingElement>(null);
  const derniere = i === CASES.length - 1;

  const aller = (j: number) => setI(Math.max(0, Math.min(CASES.length - 1, j)));
  const ouvrirDossier = () => {
    dispatch({ type: "ouvrirPiece", id: "P00" });
    dispatch({ type: "aller", etape: "regles" });
  };

  // Flèches gauche / droite partout sur l'écran, sauf dans un champ
  useEffect(() => {
    const clavier = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select, dialog")) return;
      if (e.key === "ArrowRight") setI((j) => Math.min(CASES.length - 1, j + 1));
      if (e.key === "ArrowLeft") setI((j) => Math.max(0, j - 1));
    };
    document.addEventListener("keydown", clavier);
    return () => document.removeEventListener("keydown", clavier);
  }, []);

  return (
    <section className="intro" aria-labelledby="intro-titre" aria-roledescription="carrousel">
      <div className="intro__tete">
        <h1 id="intro-titre" ref={titre} className="intro__titre">
          Le palace d&apos;azur
        </h1>
        <p className="intro__compte" aria-live="polite">
          Case {i + 1} sur {CASES.length}
        </p>
      </div>

      <div
        className="intro__scene"
        onPointerDown={(e) => (depart.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const d = depart.current;
          depart.current = null;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - d.y)) aller(i + (dx < 0 ? 1 : -1));
        }}
      >
        {CASES.map((c, j) => (
          <figure
            key={c.src}
            className={`case-bd case-bd--${c.position ?? "recit"}${c.hauteur === c.largeur ? " case-bd--carree" : ""}`}
            hidden={j !== i}
            aria-roledescription="case"
            aria-label={`Case ${j + 1} sur ${CASES.length}`}
          >
            <div className="case-bd__image">
              <Image
                src={c.src}
                alt={c.alt}
                width={c.largeur}
                height={c.hauteur}
                sizes="(min-width: 1200px) 1100px, 100vw"
                loading="eager"
                preload={j === 0}
                draggable={false}
              />
            </div>
            <figcaption className="case-bd__texte">
              {c.recits?.map((r) => (
                <span key={r} className="case-bd__recit">
                  {r}
                </span>
              ))}
              {c.bulle && <span className="case-bd__bulle">{c.bulle}</span>}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="intro__nav">
        <button type="button" className="btn-tampon" onClick={() => aller(i - 1)} disabled={i === 0}>
          Précédent
        </button>
        <ol className="intro__points" aria-hidden="true">
          {CASES.map((c, j) => (
            <li key={c.src} className={j === i ? "est-actif" : undefined} />
          ))}
        </ol>
        {derniere ? (
          <button type="button" className="btn-peinture" onClick={ouvrirDossier}>
            Ouvrir le dossier
          </button>
        ) : (
          <button type="button" className="btn-tampon" onClick={() => aller(i + 1)}>
            Suivant
          </button>
        )}
      </div>
      {!derniere && (
        <p className="intro__passer">
          <button type="button" className="lien-stylo" onClick={ouvrirDossier}>
            Passer l&apos;introduction
          </button>
        </p>
      )}
    </section>
  );
}
