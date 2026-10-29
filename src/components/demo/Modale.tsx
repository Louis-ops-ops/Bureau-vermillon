"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Modale maison sur <dialog> : piège du focus, Échap et fond inerte fournis par le navigateur.
 * Jamais de window.confirm dans la démo.
 */
export function Modale({
  ouverte,
  titre,
  onFermer,
  children,
  className = "",
}: {
  ouverte: boolean;
  titre: string;
  onFermer: () => void;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (ouverte && !d.open) d.showModal();
    if (!ouverte && d.open) d.close();
  }, [ouverte]);

  return (
    <dialog
      ref={ref}
      className={`modale ${className}`}
      aria-labelledby={`${id}-titre`}
      onClose={onFermer}
      // clic sur le voile (hors de la boîte) : on ferme
      onClick={(e) => e.target === e.currentTarget && onFermer()}
    >
      <div className="modale__boite">
        <h2 id={`${id}-titre`} className="modale__titre">
          {titre}
        </h2>
        {children}
      </div>
    </dialog>
  );
}

export function Confirmation({
  ouverte,
  titre,
  texte,
  confirmer,
  onConfirmer,
  onAnnuler,
}: {
  ouverte: boolean;
  titre: string;
  texte: string;
  confirmer: string;
  onConfirmer: () => void;
  onAnnuler: () => void;
}) {
  return (
    <Modale ouverte={ouverte} titre={titre} onFermer={onAnnuler}>
      <p className="modale__texte">{texte}</p>
      <div className="modale__actions">
        <button type="button" className="btn-tampon" onClick={onAnnuler} autoFocus>
          Annuler
        </button>
        <button type="button" className="btn-tampon" onClick={onConfirmer}>
          {confirmer}
        </button>
      </div>
    </Modale>
  );
}
