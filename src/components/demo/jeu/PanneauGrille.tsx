"use client";

import { useId, useState } from "react";
import { GRILLE, NOMS } from "@/content/demo/hot-00/dossier";
import { accusationSignee, estVerification, indicesLus, verificationFaite, type EtatDemo } from "@/lib/demo/etat";
import { dispatch } from "@/lib/demo/store";
import { Confirmation } from "../Modale";
import { Lecture } from "./PanneauRegistre";
import { useLecteurRegistre } from "./registre";

/**
 * La grille d'enquête (lot 3), en champs d'interface. Rien n'est calculé pour le joueur :
 * convertir sa réponse en numéro de paragraphe, c'est ce que la démo lui apprend.
 */
export function PanneauGrille({ etat, onOuvrirParagraphe }: { etat: EtatDemo; onOuvrirParagraphe: (n: number) => void }) {
  const id = useId();
  const g = etat.grille;
  const acte2 = etat.etape === "acte2" || etat.etape === "enveloppeC" || etat.etape === "solution";

  return (
    <div className="grille">
      <h2 className="panneau__titre">Grille d&apos;enquête</h2>

      <div className="grille__encadre">
        <p className="grille__encadre-titre">{GRILLE.verifier.titre}</p>
        <ol>
          {GRILLE.verifier.etapes.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ol>
        <p className="grille__exemple">{GRILLE.verifier.exemple}</p>
      </div>

      <section className="grille__bloc" aria-labelledby={`${id}-noms`}>
        <h3 id={`${id}-noms`} className="grille__sous-titre">
          {GRILLE.noms.titre}
        </h3>
        <p className="grille__consigne">{GRILLE.noms.consigne}</p>
        <ol className="grille__noms">
          {NOMS.map(({ n, nom }) => (
            <li key={n} className="grille__nom">
              <span className="grille__n" aria-hidden="true">
                {n}
              </span>
              <span className="grille__nom-texte" id={`${id}-nom-${n}`}>
                {nom}
              </span>
              <label className="grille__suspect">
                <input
                  type="checkbox"
                  checked={!!g.suspects[n]}
                  onChange={(e) => dispatch({ type: "suspect", n, valeur: e.target.checked })}
                  aria-describedby={`${id}-nom-${n}`}
                />
                Suspect ?
              </label>
              <label className="sr-only" htmlFor={`${id}-vraiment-${n}`}>
                Qui est vraiment {nom} ?
              </label>
              <input
                id={`${id}-vraiment-${n}`}
                className="grille__champ grille__vraiment"
                type="text"
                placeholder="Qui est-ce vraiment ?"
                value={g.vraiment[n] ?? ""}
                onChange={(e) => dispatch({ type: "vraimentNom", n, texte: e.target.value })}
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="grille__bloc grille__acte" aria-labelledby={`${id}-acte1`}>
        <div className="grille__acte-tete">
          <h3 id={`${id}-acte1`} className="grille__acte-titre">
            {GRILLE.acte1.titre}
          </h3>
          <span className="grille__meta">{GRILLE.acte1.sous}</span>
        </div>
        <p className="grille__question">{GRILLE.acte1.question}</p>
        <p className="grille__aide">{GRILLE.acte1.aide}</p>
        <div className="grille__rangee">
          <Champ label="1re personne n°" court valeur={g.acte1.n1} onChange={(v) => dispatch({ type: "acte1", champ: "n1", valeur: v })} />
          <Champ label="2e personne n°" court valeur={g.acte1.n2} onChange={(v) => dispatch({ type: "acte1", champ: "n2", valeur: v })} />
        </div>
        <Calcul
          base={GRILLE.acte1.base}
          nombre={g.acte1.nombre}
          calcul={g.acte1.calcul}
          onNombre={(v) => dispatch({ type: "acte1", champ: "nombre", valeur: v })}
          onCalcul={(v) => dispatch({ type: "acte1", champ: "calcul", valeur: v })}
        />
        <Verification etat={etat} valeur={g.acte1.calcul} onOuvrirParagraphe={onOuvrirParagraphe} />
        <p className="grille__renvois">
          Bloqués ?{" "}
          <button type="button" className="lien-stylo" onClick={() => onOuvrirParagraphe(GRILLE.acte1.indice)}>
            Indice § {GRILLE.acte1.indice}
          </button>
        </p>
      </section>

      {acte2 && <Accusation etat={etat} onOuvrirParagraphe={onOuvrirParagraphe} />}

      <section className="grille__bloc" aria-labelledby={`${id}-notes`}>
        <h3 id={`${id}-notes`} className="grille__sous-titre">
          <label htmlFor={`${id}-notes-champ`}>Notes</label>
        </h3>
        <textarea
          id={`${id}-notes-champ`}
          className="grille__champ grille__notes"
          rows={6}
          value={g.notes}
          onChange={(e) => dispatch({ type: "notes", texte: e.target.value })}
        />
      </section>
    </div>
  );
}

function Accusation({ etat, onOuvrirParagraphe }: { etat: EtatDemo; onOuvrirParagraphe: (n: number) => void }) {
  const id = useId();
  const [confirmer, setConfirmer] = useState(false);
  const a = etat.grille.accusation;
  const signee = accusationSignee(etat);
  const maj = (champ: "vraiment" | "cherchait" | "comment" | "pieces" | "nombre" | "calcul") => (v: string) =>
    dispatch({ type: "accusation", champ, valeur: v });

  return (
    <section className="grille__bloc grille__acte" aria-labelledby={`${id}-acte2`}>
      <div className="grille__acte-tete">
        <h3 id={`${id}-acte2`} className="grille__acte-titre">
          {GRILLE.acte2.titre}
        </h3>
        <span className="grille__meta">{GRILLE.acte2.sous}</span>
      </div>
      <p className="grille__question">{GRILLE.acte2.question}</p>
      <p className="grille__rappel">
        Écrivez et signez votre accusation <b>avant</b> de la vérifier. Une seule vérification. Juste ou fausse, ouvrez ensuite
        l&apos;enveloppe C.
      </p>

      <fieldset className="grille__accusation" disabled={signee}>
        <legend className="sr-only">Votre accusation</legend>
        <div className="grille__champ-bloc">
          <label htmlFor={`${id}-coupable`}>Coupable</label>
          <select
            id={`${id}-coupable`}
            className="grille__champ"
            value={a.coupable ?? ""}
            onChange={(e) => dispatch({ type: "coupable", n: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">Choisir dans la liste des noms</option>
            {NOMS.map(({ n, nom }) => (
              <option key={n} value={n}>
                n° {n} — {nom}
              </option>
            ))}
          </select>
        </div>
        <Champ label="Qui est-il vraiment" valeur={a.vraiment} onChange={maj("vraiment")} />
        <Champ label="Que cherchait-il" valeur={a.cherchait} onChange={maj("cherchait")} />
        <Champ label="Comment" valeur={a.comment} onChange={maj("comment")} multiligne />
        <Champ label="Les pièces qui le prouvent (P__)" valeur={a.pieces} onChange={maj("pieces")} />
      </fieldset>

      {signee ? (
        <p className="grille__signee" role="status">
          <span className="tampon-meta tampon-meta--laiton">Accusation signée</span>
          <span>
            le{" "}
            {new Date(a.signeeA!).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}. Elle ne
            peut plus être modifiée.
          </span>
        </p>
      ) : (
        <div className="grille__signer">
          <button type="button" className="btn-tampon" disabled={a.coupable === undefined} onClick={() => setConfirmer(true)}>
            Signer l&apos;accusation
          </button>
          {a.coupable === undefined && <p className="grille__aide">Choisissez d&apos;abord un coupable.</p>}
        </div>
      )}

      {/* hors du verrou : on signe d'abord, puis on calcule le § et on vérifie une seule fois */}
      <div className="grille__verifier-acte2">
        <Calcul base={GRILLE.acte2.base} nombre={a.nombre} calcul={a.calcul} onNombre={maj("nombre")} onCalcul={maj("calcul")} />
        <Verification etat={etat} valeur={a.calcul} accusation onOuvrirParagraphe={onOuvrirParagraphe} />
      </div>

      <p className="grille__renvois">
        Bloqués avant d&apos;accuser ?{" "}
        {GRILLE.acte2.indices.map((ind, i) => (
          <span key={ind.n}>
            {i > 0 && " · "}
            {ind.libelle} :{" "}
            <button type="button" className="lien-stylo" onClick={() => onOuvrirParagraphe(ind.n)}>
              § {ind.n}
            </button>
          </span>
        ))}
      </p>
      <p className="grille__aide">
        Indices à l&apos;envers lus : <b>{indicesLus(etat)}</b> → {GRILLE.acte2.indicesLus}
      </p>

      <Confirmation
        ouverte={confirmer}
        titre="Signer l'accusation ?"
        texte="Une fois signée, votre accusation ne peut plus être modifiée."
        confirmer="Signer"
        onConfirmer={() => {
          dispatch({ type: "signer", now: Date.now() });
          setConfirmer(false);
        }}
        onAnnuler={() => setConfirmer(false)}
      />
    </section>
  );
}

/**
 * Vérifier sans quitter la grille : le registre ouvre le paragraphe que le joueur a écrit dans la case
 * « = § », et lui seul. Rien n'est comparé à la bonne réponse : un mauvais calcul tombe sur un leurre,
 * exactement comme au registre. Les renvois vers les indices, eux, ouvrent l'onglet Registre.
 */
function Verification({
  etat,
  valeur,
  accusation,
  onOuvrirParagraphe,
}: {
  etat: EtatDemo;
  valeur?: string;
  accusation?: boolean;
  onOuvrirParagraphe: (n: number) => void;
}) {
  const lecteur = useLecteurRegistre();
  const [confirmer, setConfirmer] = useState(false);
  const texte = valeur?.trim() ?? "";
  const n = Number(texte);
  const bloquee = accusation && !accusationSignee(etat);

  const verifier = () => {
    // la vérification de l'acte 2 ne se fait qu'une fois : on prévient avant de la consommer
    if (accusation && estVerification(n) && !verificationFaite(etat)) setConfirmer(true);
    else lecteur.ouvrir(n);
  };

  const aide = bloquee
    ? "Signez d'abord votre accusation : vous n'aurez droit qu'à une vérification."
    : texte
      ? `Le registre ouvre le § ${texte}, et lui seul.`
      : "Écrivez d'abord le numéro du paragraphe dans la case « = § ».";

  return (
    <div className="verification">
      <div className="verification__ligne">
        <button type="button" className="btn-tampon" disabled={!lecteur.pret || !texte || bloquee} onClick={verifier}>
          {accusation ? "Vérifier mon accusation" : "Vérifier au registre"}
        </button>
        <p className="grille__aide">{aide}</p>
      </div>
      <div className="verification__reponse" aria-live="polite" aria-atomic="true">
        {lecteur.lecture && (
          <Lecture
            key={lecteur.lecture.cle}
            reponse={lecteur.lecture.reponse}
            retourne={lecteur.lecture.retourne}
            onRetourner={lecteur.retourner}
            onOuvrir={onOuvrirParagraphe}
          />
        )}
      </div>
      {accusation && (
        <Confirmation
          ouverte={confirmer}
          titre="Vérifier votre accusation ?"
          texte={`Vous n'avez droit qu'à une vérification. Le registre va ouvrir le § ${texte}. Juste ou fausse, vous ouvrirez ensuite l'enveloppe C.`}
          confirmer={`Ouvrir le § ${texte}`}
          onConfirmer={() => {
            setConfirmer(false);
            lecteur.ouvrir(n);
          }}
          onAnnuler={() => setConfirmer(false)}
        />
      )}
    </div>
  );
}

function Champ({
  label,
  valeur,
  onChange,
  court,
  multiligne,
}: {
  label: string;
  valeur?: string;
  onChange: (v: string) => void;
  court?: boolean;
  multiligne?: boolean;
}) {
  const id = useId();
  return (
    <div className={`grille__champ-bloc${court ? " grille__champ-bloc--court" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {multiligne ? (
        <textarea id={id} className="grille__champ" rows={3} value={valeur ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={id}
          className="grille__champ"
          type="text"
          inputMode={court ? "numeric" : undefined}
          value={valeur ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/** « § base + ____ = § ____ » : deux cases que le joueur remplit lui-même. */
function Calcul({
  base,
  nombre,
  calcul,
  onNombre,
  onCalcul,
}: {
  base: number;
  nombre?: string;
  calcul?: string;
  onNombre: (v: string) => void;
  onCalcul: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="grille__calcul" role="group" aria-label={`Calcul du paragraphe, base ${base}`}>
      <span aria-hidden="true">§ {base} +</span>
      <label className="sr-only" htmlFor={`${id}-nombre`}>
        Nombre à ajouter à {base}
      </label>
      <input
        id={`${id}-nombre`}
        className="grille__champ grille__case"
        type="text"
        inputMode="numeric"
        maxLength={3}
        value={nombre ?? ""}
        onChange={(e) => onNombre(e.target.value)}
      />
      <span aria-hidden="true">= §</span>
      <label className="sr-only" htmlFor={`${id}-calcul`}>
        Paragraphe à ouvrir
      </label>
      <input
        id={`${id}-calcul`}
        className="grille__champ grille__case"
        type="text"
        inputMode="numeric"
        maxLength={3}
        value={calcul ?? ""}
        onChange={(e) => onCalcul(e.target.value)}
      />
    </div>
  );
}
