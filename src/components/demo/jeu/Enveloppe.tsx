"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { GARDE_A, GARDE_C } from "@/content/demo/hot-00/dossier";
import { dispatch } from "@/lib/demo/store";
import { Garde } from "../pieces/Doc";

/** Une page A4 mise à l'échelle de son conteneur, sans zoom (page de garde). */
export function PageAjustee({ children }: { children: ReactNode }) {
  const cadre = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [mesure, setMesure] = useState({ echelle: 0, hauteur: 0 });

  useEffect(() => {
    const c = cadre.current!;
    const p = page.current!;
    const ro = new ResizeObserver(() => {
      const echelle = Math.min(1, c.clientWidth / 794);
      setMesure({ echelle, hauteur: p.offsetHeight * echelle });
    });
    ro.observe(c);
    ro.observe(p);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={cadre} className="page-ajustee" style={{ height: mesure.hauteur || undefined }}>
      <div ref={page} className="page-ajustee__page" style={{ transform: `scale(${mesure.echelle})`, visibility: mesure.echelle ? "visible" : "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/**
 * L'ouverture d'une enveloppe : kraft en CSS, le rabat s'ouvre, la page de garde sort.
 * A : 600 ms au plus. C : le sceau vermillon se brise d'abord. Tout est coupé en mouvement réduit.
 */
export function Enveloppe({ lettre }: { lettre: "A" | "C" }) {
  const a = lettre === "A";
  return (
    <section className={`ouverture ouverture--${lettre.toLowerCase()}`} aria-labelledby="ouverture-titre">
      <h1 id="ouverture-titre" className="sr-only">
        {a ? "Enveloppe A ouverte" : "Enveloppe C ouverte"}
      </h1>
      <div className="pli" aria-hidden="true">
        <span className="pli__feuille" />
        <span className="pli__corps">
          <span className="pli__etiquette">{a ? "À ouvrir après l'acte 1" : "La solution — après l'accusation signée"}</span>
        </span>
        <span className="pli__rabat" />
        {!a && (
          <span className="pli__sceau">
            <span className="pli__moitie pli__moitie--g" />
            <span className="pli__moitie pli__moitie--d" />
          </span>
        )}
        <span className="pli__lettre">{lettre}</span>
      </div>

      <div className="ouverture__garde">
        <PageAjustee>
          {a ? (
            <Garde lettre={GARDE_A.lettre} titre={GARDE_A.titre} consigne={GARDE_A.consigne} />
          ) : (
            <Garde lettre={GARDE_C.lettre} titre={GARDE_C.titre} consigne={GARDE_C.consigne} sous={GARDE_C.sous} />
          )}
        </PageAjustee>
      </div>

      <div className="ouverture__suite">
        {a ? (
          <>
            <p>Trois nouvelles pièces rejoignent la table : P05, P06 et P07.</p>
            <button type="button" className="btn-tampon" onClick={() => dispatch({ type: "aller", etape: "acte2" })}>
              Poser les pièces sur la table
            </button>
          </>
        ) : (
          <button type="button" className="btn-tampon" onClick={() => dispatch({ type: "aller", etape: "solution" })}>
            Lire la solution
          </button>
        )}
      </div>
    </section>
  );
}
