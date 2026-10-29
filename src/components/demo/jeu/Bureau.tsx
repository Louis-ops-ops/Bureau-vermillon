"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { IdPiece } from "@/content/demo/hot-00/dossier";
import { acte1Valide, verificationFaite, type EtatDemo } from "@/lib/demo/etat";
import { dispatch, useMedia } from "@/lib/demo/store";
import { PanneauGrille } from "./PanneauGrille";
import { PanneauRegistre } from "./PanneauRegistre";
import { useLecteurRegistre } from "./registre";
import { piecesDisponibles, TablePieces } from "./TablePieces";
import { Visionneuse } from "./Visionneuse";

type Onglet = "pieces" | "grille" | "registre";

/**
 * Le bureau des actes 1 et 2. Bureau (≥ 1024 px) : la table à gauche, la pièce au centre, la grille et le
 * registre à droite. Mobile : trois onglets en bas, la pièce s'ouvre en feuille plein écran.
 */
export function Bureau({ etat }: { etat: EtatDemo }) {
  const large = useMedia("(min-width: 1024px)");
  const lecteur = useLecteurRegistre();
  const [ongletMobile, setOngletMobile] = useState<Onglet>("pieces");
  const [ongletPanneau, setOngletPanneau] = useState<"grille" | "registre">("grille");
  const [piece, setPiece] = useState<IdPiece | undefined>();
  const [feuilleOuverte, setFeuilleOuverte] = useState(false);

  const acte2 = etat.etape === "acte2";
  const disponibles = piecesDisponibles(acte2);

  const ouvrirPiece = (id: IdPiece) => {
    setPiece(id);
    dispatch({ type: "ouvrirPiece", id });
    if (!large) setFeuilleOuverte(true);
  };

  const voisine = (sens: 1 | -1) => {
    const i = disponibles.findIndex((p) => p.id === piece);
    const p = disponibles[i + sens];
    return p ? () => ouvrirPiece(p.id) : undefined;
  };

  // Un renvoi depuis la grille ouvre le paragraphe et montre le registre
  const ouvrirParagraphe = (n: number) => {
    lecteur.ouvrir(n);
    setOngletPanneau("registre");
    setOngletMobile("registre");
  };

  const action =
    etat.etape === "acte1" && acte1Valide(etat)
      ? { texte: "Acte 1 validé au registre.", libelle: "Ouvrir l'enveloppe A", etape: "enveloppeA" as const }
      : acte2 && verificationFaite(etat)
        ? { texte: "Votre accusation est vérifiée.", libelle: "Ouvrir l'enveloppe C", etape: "enveloppeC" as const }
        : null;

  const panneaux = {
    grille: <PanneauGrille etat={etat} onOuvrirParagraphe={ouvrirParagraphe} />,
    registre: <PanneauRegistre lecteur={lecteur} />,
  };

  const barreAction = action && (
    <div className="bureau__action">
      <p className="bureau__action-texte">{action.texte}</p>
      <button type="button" className="btn-peinture" onClick={() => dispatch({ type: "aller", etape: action.etape })}>
        {action.libelle}
      </button>
    </div>
  );

  if (large) {
    return (
      <div className={`bureau${action ? " bureau--action" : ""}`}>
        <aside className="bureau__table" aria-label="La table : pièces du dossier">
          <TablePieces disponibles={disponibles} ouvertes={etat.piecesOuvertes} active={piece} onOuvrir={ouvrirPiece} />
        </aside>
        <section className="bureau__centre" aria-label="Pièce ouverte">
          {piece ? (
            <Visionneuse key={piece} id={piece} onPrecedent={voisine(-1)} onSuivant={voisine(1)} />
          ) : (
            <div className="bureau__vide">
              <p className="bureau__vide-titre">Choisissez une pièce sur la table.</p>
              <p>Elle s&apos;ouvre ici, à taille réelle. Zoomez avec + et −, ou Ctrl + molette.</p>
            </div>
          )}
        </section>
        <section className="bureau__panneau" aria-label="Grille et registre">
          <Onglets
            valeur={ongletPanneau}
            onChange={setOngletPanneau}
            options={[
              { id: "grille", libelle: "Grille" },
              { id: "registre", libelle: "Registre" },
            ]}
            prefixe="panneau"
          />
          {(["grille", "registre"] as const).map((o) => (
            <div key={o} id={`panneau-${o}`} role="tabpanel" aria-labelledby={`panneau-${o}-onglet`} hidden={ongletPanneau !== o} className="bureau__defile">
              {panneaux[o]}
            </div>
          ))}
        </section>
        {barreAction}
      </div>
    );
  }

  return (
    <div className="bureau bureau--mobile">
      {(["pieces", "grille", "registre"] as const).map((o) => (
        <div key={o} id={`mobile-${o}`} role="tabpanel" aria-labelledby={`mobile-${o}-onglet`} hidden={ongletMobile !== o} className="bureau__defile">
          {o === "pieces" ? (
            <div className="bureau__table-mobile">
              <h2 className="panneau__titre">La table</h2>
              <TablePieces disponibles={disponibles} ouvertes={etat.piecesOuvertes} active={piece} onOuvrir={ouvrirPiece} />
            </div>
          ) : (
            panneaux[o]
          )}
        </div>
      ))}
      {barreAction}
      <Onglets
        valeur={ongletMobile}
        onChange={setOngletMobile}
        options={[
          { id: "pieces", libelle: "Pièces" },
          { id: "grille", libelle: "Grille" },
          { id: "registre", libelle: "Registre" },
        ]}
        prefixe="mobile"
        bas
      />
      {piece && <FeuillePiece ouverte={feuilleOuverte} onFermer={() => setFeuilleOuverte(false)}>
        <Visionneuse key={piece} id={piece} onPrecedent={voisine(-1)} onSuivant={voisine(1)} onFermer={() => setFeuilleOuverte(false)} />
      </FeuillePiece>}
    </div>
  );
}

/** Onglets accessibles : flèches gauche / droite, Début, Fin. */
function Onglets<T extends string>({
  valeur,
  onChange,
  options,
  prefixe,
  bas,
}: {
  valeur: T;
  onChange: (v: T) => void;
  options: { id: T; libelle: string }[];
  prefixe: string;
  bas?: boolean;
}) {
  const liste = useRef<HTMLDivElement>(null);
  const clavier = (e: KeyboardEvent) => {
    const i = options.findIndex((o) => o.id === valeur);
    const cible =
      e.key === "ArrowRight" ? (i + 1) % options.length
      : e.key === "ArrowLeft" ? (i - 1 + options.length) % options.length
      : e.key === "Home" ? 0
      : e.key === "End" ? options.length - 1
      : -1;
    if (cible < 0) return;
    e.preventDefault();
    onChange(options[cible].id);
    liste.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[cible]?.focus();
  };
  return (
    <div ref={liste} role="tablist" className={`onglets-jeu${bas ? " onglets-jeu--bas" : ""}`} onKeyDown={clavier}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          id={`${prefixe}-${o.id}-onglet`}
          aria-selected={valeur === o.id}
          aria-controls={`${prefixe}-${o.id}`}
          tabIndex={valeur === o.id ? 0 : -1}
          className="onglet-jeu"
          onClick={() => onChange(o.id)}
        >
          {o.libelle}
        </button>
      ))}
    </div>
  );
}

/** Mobile : la pièce en feuille modale plein écran (Échap ou « Fermer » pour revenir à la table). */
function FeuillePiece({ ouverte, onFermer, children }: { ouverte: boolean; onFermer: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    if (ouverte && !d.open) d.showModal();
    if (!ouverte && d.open) d.close();
  }, [ouverte]);
  return (
    <dialog ref={ref} className="feuille-piece" aria-label="Pièce ouverte" onClose={onFermer}>
      {ouverte && children}
    </dialog>
  );
}
