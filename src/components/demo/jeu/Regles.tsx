"use client";

import { useId, useState } from "react";
import { REGLES } from "@/content/demo/hot-00/dossier";
import { dispatch } from "@/lib/demo/store";

const EXERCICE = 207;

/** Le texte « Comment vérifier une réponse » (brief, section 9), partagé avec la modale du menu. */
export function ContenuRegles() {
  return (
    <div className="regles__contenu">
      <p>{REGLES.intro}</p>
      <ol className="regles__etapes">
        {REGLES.etapes.map((e, i) => (
          <li key={e}>
            <span className="regles__num" aria-hidden="true">
              {i + 1}
            </span>
            {e}
          </li>
        ))}
      </ol>
      <p className="regles__exemple">{REGLES.exemple}</p>
      <p>{REGLES.bloques}</p>
    </div>
  );
}

/** L'écran de règles, une fois après l'intro, avec l'exercice facultatif du § 207. */
export function Regles() {
  return (
    <section className="regles" aria-labelledby="regles-titre">
      <div className="regles__texte">
        <p className="regles__surtitre">Avant d&apos;ouvrir le dossier</p>
        <h1 id="regles-titre" className="regles__titre">
          {REGLES.titre}
        </h1>
        <ContenuRegles />
        <div className="regles__suite">
          <button type="button" className="btn-tampon" onClick={() => dispatch({ type: "aller", etape: "acte1" })}>
            Commencer l&apos;acte 1
          </button>
        </div>
      </div>
      <div className="regles__exercice">
        <p className="regles__consigne">{REGLES.exercice}</p>
        <Exercice />
      </div>
    </section>
  );
}

/**
 * Un registre d'entraînement : il ne répond qu'au § 207, celui de l'exemple. Il ne charge pas le vrai
 * registre et ne touche pas à la partie (impossible d'ouvrir le § 156 avant d'avoir lu une pièce).
 */
function Exercice() {
  const id = useId();
  const [saisie, setSaisie] = useState("");
  const [reponse, setReponse] = useState<{ cle: number; juste: boolean } | null>(null);

  const lire = (e: React.FormEvent) => {
    e.preventDefault();
    setReponse((r) => ({ cle: (r?.cle ?? 0) + 1, juste: Number(saisie) === EXERCICE }));
  };

  return (
    <div className="registre">
      <form className="registre__form" onSubmit={lire}>
        <label htmlFor={`${id}-n`} className="registre__label">
          Ouvrir le §
        </label>
        <div className="registre__ligne">
          <input
            id={`${id}-n`}
            className="registre__champ"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            autoComplete="off"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value.replace(/D/g, ""))}
          />
          <button type="submit" className="btn-tampon registre__lire" disabled={!saisie}>
            Lire
          </button>
        </div>
      </form>
      <div className="registre__reponse" aria-live="polite" aria-atomic="true">
        {reponse &&
          (reponse.juste ? (
            <div key={reponse.cle} className="registre__lecture">
              <p className="registre__message registre__message--inexistant">
                <span className="registre__message-n">§ {EXERCICE}</span>
                Ce paragraphe n&apos;existe pas.
              </p>
              <p className="regles__bravo">Parfait, vous avez compris !</p>
            </div>
          ) : (
            <p key={reponse.cle} className="registre__message">
              Pour l&apos;exercice, ouvrez le § {EXERCICE}.
            </p>
          ))}
      </div>
    </div>
  );
}
