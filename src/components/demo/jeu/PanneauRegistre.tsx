"use client";

import { useId, useRef, useState } from "react";
import { REGLES } from "@/content/demo/hot-00/dossier";
import { libelleRenvoi, type Reponse } from "@/lib/demo/registre";
import { useDemo } from "@/lib/demo/store";
import type { LecteurRegistre } from "./registre";

/** Messages du registre quand il n'y a pas de paragraphe à lire (brief, 5.7). */
const MESSAGES: Record<Exclude<Reponse["cas"], "paragraphe">, string> = {
  "hors-plage": "Les paragraphes vont de 100 à 999.",
  inexistant: "Ce paragraphe n'existe pas. Refaites le calcul.",
  "non-signee": "Signez d'abord votre accusation sur la grille. Vous n'aurez droit qu'à une vérification.",
  "deja-verifie": "Vous avez déjà vérifié votre accusation.",
};

/**
 * Le registre et le livret d'indices, comme le lot 6 imprimé : un numéro, un bouton, et rien d'autre.
 * Aucune liste, aucun sommaire : on n'entre que par un numéro calculé.
 */
export function PanneauRegistre({ lecteur, rappel = true }: { lecteur: LecteurRegistre; rappel?: boolean }) {
  const id = useId();
  const etat = useDemo();
  const champ = useRef<HTMLInputElement>(null);
  const [saisie, setSaisie] = useState("");
  const { lecture, ouvrir, retourner, pret } = lecteur;

  // les 5 derniers § ouverts, le plus récent d'abord, sans doublon
  const historique = [...new Set([...(etat?.paragraphesLus ?? [])].reverse())].slice(0, 5);

  const lire = (e: React.FormEvent) => {
    e.preventDefault();
    ouvrir(saisie.trim() === "" ? Number.NaN : Number(saisie));
  };

  return (
    <div className="registre">
      <h2 className="panneau__titre">Registre et indices</h2>

      {rappel && (
        <details className="registre__rappel">
          <summary>{REGLES.titre}</summary>
          <p>{REGLES.intro}</p>
          <ol>
            {REGLES.etapes.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ol>
          <p className="registre__exemple">{REGLES.exemple}</p>
          <p>{REGLES.bloques}</p>
        </details>
      )}

      <form className="registre__form" onSubmit={lire}>
        <label htmlFor={`${id}-n`} className="registre__label">
          Ouvrir le §
        </label>
        <div className="registre__ligne">
          <input
            ref={champ}
            id={`${id}-n`}
            className="registre__champ"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            autoComplete="off"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value.replace(/\D/g, ""))}
            aria-describedby={`${id}-plage`}
          />
          <button type="submit" className="btn-tampon registre__lire" disabled={!pret}>
            Lire
          </button>
        </div>
        <p id={`${id}-plage`} className="registre__aide">
          {pret ? "De 100 à 999." : "Ouverture du registre…"}
        </p>
      </form>

      <div className="registre__reponse" aria-live="polite" aria-atomic="true">
        {lecture && <Lecture key={lecture.cle} reponse={lecture.reponse} retourne={lecture.retourne} onRetourner={retourner} onOuvrir={ouvrir} />}
      </div>

      {historique.length > 0 && (
        <div className="registre__historique">
          <p className="registre__label">Derniers § ouverts</p>
          <ul>
            {historique.map((n) => (
              <li key={n}>
                <button type="button" className="registre__puce" onClick={() => ouvrir(n)} aria-label={`Relire le paragraphe ${n}`}>
                  § {n}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Ce que le registre montre pour un numéro ; partagé avec la vérification de la grille. */
export function Lecture({
  reponse,
  retourne,
  onRetourner,
  onOuvrir,
}: {
  reponse: Reponse;
  retourne: boolean;
  onRetourner: () => void;
  onOuvrir: (n: number) => void;
}) {
  if (reponse.cas !== "paragraphe") {
    return (
      <p className={`registre__message registre__message--${reponse.cas}`}>
        {"n" in reponse && <span className="registre__message-n">§ {reponse.n}</span>}
        {MESSAGES[reponse.cas]}
      </p>
    );
  }

  const { p } = reponse;
  const renvoi = libelleRenvoi(p);

  // Imprimé tête-bêche : le texte n'entre dans le DOM qu'une fois le feuillet retourné.
  if (p.teteBeche && !retourne) {
    return (
      <div className="registre__lecture">
        <div className="feuillet feuillet--verso">
          <span className="feuillet__n">§ {p.n}</span>
          <p className="feuillet__verso">Ce paragraphe est imprimé à l&apos;envers.</p>
        </div>
        <button type="button" className="btn-tampon registre__retourner" onClick={onRetourner}>
          Retourner le paragraphe
        </button>
      </div>
    );
  }

  return (
    <div className="registre__lecture">
      <div className={`feuillet${p.teteBeche ? " feuillet--retourne" : ""}`}>
        <span className="feuillet__n">§ {p.n}</span>
        <p className="feuillet__texte">{p.t}</p>
      </div>
      {renvoi && p.renvoi !== undefined && (
        <button type="button" className="lien-stylo registre__renvoi" onClick={() => onOuvrir(p.renvoi!)}>
          {renvoi}
        </button>
      )}
    </div>
  );
}
