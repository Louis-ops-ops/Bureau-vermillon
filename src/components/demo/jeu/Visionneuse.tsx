"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PIECES, type IdPiece } from "@/content/demo/hot-00/dossier";
import { P00, P01, P02, P03, P04 } from "../pieces/Acte1";

// L'enveloppe A n'est chargée qu'une fois ouverte : P05 à P07 ne sont ni dans le bundle principal ni dans le DOM avant.
const PieceActe2 = dynamic(() => import("../pieces/Acte2"), { loading: () => <div className="doc" /> });

const ACTE1 = { P00, P01, P02, P03, P04 };

export function RenduPiece({ id }: { id: IdPiece }) {
  if (id === "P05" || id === "P06" || id === "P07") return <PieceActe2 id={id} />;
  const Piece = ACTE1[id];
  return <Piece />;
}

/** 210 mm à 96 dpi : la largeur de la feuille avant mise à l'échelle. */
const LARGEUR_A4 = 794;
const MARGE = 16;
const ZOOM_MAX = 5;
const ZOOM_DOUBLE = 2.5;
const borner = (z: number) => Math.min(ZOOM_MAX, Math.max(1, z));

/**
 * La pièce est rendue à largeur fixe façon A4, avec sa propre DA, puis mise à l'échelle de la zone.
 * Zoom : boutons, Ctrl + molette (pincement du trackpad), pincement et double-tap au doigt, double-clic,
 * touches + / − / 0. Le déplacement passe par le défilement natif de la zone (molette, clavier, barres).
 */
export function Visionneuse({
  id,
  onPrecedent,
  onSuivant,
  onFermer,
}: {
  id: IdPiece;
  onPrecedent?: () => void;
  onSuivant?: () => void;
  onFermer?: () => void;
}) {
  const zone = useRef<HTMLDivElement>(null);
  const feuille = useRef<HTMLDivElement>(null);
  const [taille, setTaille] = useState({ largeur: 0, hauteur: 1123 });
  const [zoom, setZoom] = useState(1);
  const meta = PIECES.find((p) => p.id === id)!;

  const ajuste = taille.largeur ? Math.min(1.2, (taille.largeur - MARGE * 2) / LARGEUR_A4) : 0;
  const echelle = ajuste * zoom;
  const largeurPlan = LARGEUR_A4 * echelle + MARGE * 2;
  const hauteurPlan = taille.hauteur * echelle + MARGE * 2;

  // dernier rendu connu, lu par les gestionnaires d'événements (jamais pendant le rendu)
  const vu = useRef({ echelle, largeurPlan, zoom });
  const focal = useRef<{ px: number; py: number; cx: number; cy: number } | null>(null);

  // Largeur de la zone et hauteur réelle de la feuille (une pièce peut dépasser 297 mm)
  useEffect(() => {
    const z = zone.current!;
    const f = feuille.current!;
    const ro = new ResizeObserver(() => setTaille({ largeur: z.clientWidth, hauteur: f.offsetHeight }));
    ro.observe(z);
    ro.observe(f);
    return () => ro.disconnect();
  }, []);

  // Après un zoom, on replace le défilement pour que le point visé reste sous le doigt ou le pointeur.
  useLayoutEffect(() => {
    vu.current = { echelle, largeurPlan, zoom };
    const f = focal.current;
    const z = zone.current;
    if (!f || !z) return;
    focal.current = null;
    const decalage = Math.max(0, (z.clientWidth - largeurPlan) / 2);
    z.scrollLeft = f.px * echelle + MARGE + decalage - f.cx;
    z.scrollTop = f.py * echelle + MARGE - f.cy;
  }, [echelle, largeurPlan, zoom]);

  const zoomer = (cible: number, cx?: number, cy?: number) => {
    const z = zone.current;
    if (!z || !vu.current.echelle) return;
    const x = cx ?? z.clientWidth / 2;
    const y = cy ?? z.clientHeight / 2;
    const decalage = Math.max(0, (z.clientWidth - vu.current.largeurPlan) / 2);
    focal.current = {
      px: (z.scrollLeft + x - MARGE - decalage) / vu.current.echelle,
      py: (z.scrollTop + y - MARGE) / vu.current.echelle,
      cx: x,
      cy: y,
    };
    setZoom(borner(cible));
  };

  // Ctrl + molette = pincement du trackpad : écouteur non passif pour empêcher le zoom de la page
  useEffect(() => {
    const z = zone.current!;
    const surMolette = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = z.getBoundingClientRect();
      zoomer(vu.current.zoom * Math.exp(-e.deltaY / 200), e.clientX - r.left, e.clientY - r.top);
    };
    z.addEventListener("wheel", surMolette, { passive: false });
    return () => z.removeEventListener("wheel", surMolette);
    // zoomer ne lit que des refs : l'abonnement unique suffit
  }, []);

  /* ---------- Doigts : glisser, pincer, double-tap (touch-action: none sur la zone) ---------- */
  const doigts = useRef(new Map<number, { x: number; y: number }>());
  const pince = useRef<{ distance: number; zoom: number } | null>(null);
  const tap = useRef<{ t: number; x: number; y: number; bouge: boolean }>({ t: 0, x: 0, y: 0, bouge: false });
  const dernierTap = useRef<{ t: number; x: number; y: number } | null>(null);
  const elan = useRef<{ vx: number; vy: number; t: number; raf?: number }>({ vx: 0, vy: 0, t: 0 });

  const local = (e: React.PointerEvent) => {
    const r = zone.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const arreterElan = () => {
    if (elan.current.raf) cancelAnimationFrame(elan.current.raf);
    elan.current.raf = undefined;
  };

  const surBas = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    arreterElan();
    zone.current!.setPointerCapture(e.pointerId);
    const p = local(e);
    doigts.current.set(e.pointerId, p);
    if (doigts.current.size === 1) tap.current = { t: e.timeStamp, x: p.x, y: p.y, bouge: false };
    if (doigts.current.size === 2) {
      const [a, b] = [...doigts.current.values()];
      pince.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom: vu.current.zoom };
      tap.current.bouge = true;
    }
  };

  const surMouvement = (e: React.PointerEvent) => {
    const avant = doigts.current.get(e.pointerId);
    if (!avant) return;
    const p = local(e);
    doigts.current.set(e.pointerId, p);
    const z = zone.current!;

    if (doigts.current.size === 1) {
      const dx = p.x - avant.x;
      const dy = p.y - avant.y;
      if (Math.hypot(p.x - tap.current.x, p.y - tap.current.y) > 10) tap.current.bouge = true;
      z.scrollLeft -= dx;
      z.scrollTop -= dy;
      const dt = Math.max(1, e.timeStamp - elan.current.t);
      elan.current = { vx: -dx / dt, vy: -dy / dt, t: e.timeStamp };
    } else if (doigts.current.size === 2 && pince.current) {
      const [a, b] = [...doigts.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      zoomer((pince.current.zoom * distance) / pince.current.distance, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
  };

  const surHaut = (e: React.PointerEvent) => {
    if (!doigts.current.has(e.pointerId)) return;
    doigts.current.delete(e.pointerId);
    if (doigts.current.size < 2) pince.current = null;
    if (doigts.current.size > 0) return;

    const p = local(e);
    const estTap = !tap.current.bouge && e.timeStamp - tap.current.t < 300;
    if (estTap) {
      const d = dernierTap.current;
      if (d && e.timeStamp - d.t < 320 && Math.hypot(p.x - d.x, p.y - d.y) < 30) {
        zoomer(vu.current.zoom > 1 ? 1 : ZOOM_DOUBLE, p.x, p.y);
        dernierTap.current = null;
      } else {
        dernierTap.current = { t: e.timeStamp, x: p.x, y: p.y };
      }
      return;
    }

    // élan court après un glissé, coupé en mouvement réduit
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let { vx, vy } = elan.current;
    if (e.timeStamp - elan.current.t > 80 || Math.hypot(vx, vy) < 0.2) return;
    let precedent = performance.now();
    const pas = (t: number) => {
      const dt = t - precedent;
      precedent = t;
      zone.current!.scrollLeft += vx * dt;
      zone.current!.scrollTop += vy * dt;
      const amorti = Math.pow(0.94, dt / 16);
      vx *= amorti;
      vy *= amorti;
      elan.current.raf = Math.hypot(vx, vy) > 0.02 ? requestAnimationFrame(pas) : undefined;
    };
    elan.current.raf = requestAnimationFrame(pas);
  };

  useEffect(() => arreterElan, []);

  const surTouche = (e: React.KeyboardEvent) => {
    if (e.key === "+" || e.key === "=") zoomer(vu.current.zoom * 1.25);
    else if (e.key === "-") zoomer(vu.current.zoom / 1.25);
    else if (e.key === "0") zoomer(1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="visionneuse">
      <div className="visionneuse__barre">
        <p className="visionneuse__titre">
          <span className="visionneuse__ref">{id}</span> {meta.titre}
        </p>
        {onFermer && (
          <button type="button" className="btn-tampon visionneuse__fermer" onClick={onFermer}>
            Fermer
          </button>
        )}
        <div className={`visionneuse__outils${onFermer ? " visionneuse__outils--ligne" : ""}`}>
          <div className="visionneuse__groupe" role="group" aria-label="Zoom">
            <button type="button" className="outil" onClick={() => zoomer(vu.current.zoom / 1.25)} disabled={zoom <= 1} aria-label="Dézoomer">
              −
            </button>
            <button type="button" className="outil outil--texte" onClick={() => zoomer(1)} aria-label="Ajuster la pièce à la zone">
              {Math.round(zoom * 100)} %
            </button>
            <button type="button" className="outil" onClick={() => zoomer(vu.current.zoom * 1.25)} disabled={zoom >= ZOOM_MAX} aria-label="Zoomer">
              +
            </button>
          </div>
          <div className="visionneuse__groupe" role="group" aria-label="Pièces">
            <button type="button" className="outil" onClick={onPrecedent} disabled={!onPrecedent} aria-label="Pièce précédente">
              ‹
            </button>
            <button type="button" className="outil" onClick={onSuivant} disabled={!onSuivant} aria-label="Pièce suivante">
              ›
            </button>
          </div>
        </div>
      </div>

      <div
        ref={zone}
        className="visionneuse__zone"
        tabIndex={0}
        role="region"
        aria-label={`${id}, ${meta.titre}. Touches plus et moins pour zoomer, flèches pour se déplacer.`}
        onPointerDown={surBas}
        onPointerMove={surMouvement}
        onPointerUp={surHaut}
        onPointerCancel={surHaut}
        onDoubleClick={(e) => {
          const r = zone.current!.getBoundingClientRect();
          zoomer(vu.current.zoom > 1 ? 1 : ZOOM_DOUBLE, e.clientX - r.left, e.clientY - r.top);
        }}
        onKeyDown={surTouche}
      >
        <div className="visionneuse__plan" style={{ width: largeurPlan, height: hauteurPlan, visibility: ajuste ? "visible" : "hidden" }}>
          <div ref={feuille} className="visionneuse__feuille" style={{ transform: `scale(${echelle})` }}>
            <RenduPiece id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
