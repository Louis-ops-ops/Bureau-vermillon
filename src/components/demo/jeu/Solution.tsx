"use client";

// Enveloppe C : chargée en import dynamique (next/dynamic), seulement une fois l'enveloppe ouverte.
import Link from "next/link";
import { useEffect, useRef } from "react";
import { GRADES, gradePour } from "@/content/demo/hot-00/grades";
import { nomPour } from "@/content/demo/hot-00/dossier";
import { BAREME, ENCADRE, EPILOGUE, FAUSSES_PISTES, INNOCENTS, RECIT, RECONSTITUTION, type LigneBareme } from "@/content/demo/hot-00/solution";
import { coupableTrouve, indicesLus, score, TOTAL_POSSIBLE, type EtatDemo } from "@/lib/demo/etat";
import { dispatch } from "@/lib/demo/store";
import { track } from "@/lib/demo/track";

/** Ce que le joueur a écrit dans le champ de son accusation qui correspond à la ligne. */
function ecrit(etat: EtatDemo, ligne: LigneBareme) {
  const a = etat.grille.accusation;
  if (ligne.champ === "coupable") return a.coupable ? `n° ${a.coupable} — ${nomPour(a.coupable)}` : "";
  return String(a[ligne.champ] ?? "").trim();
}

export default function Solution({ etat }: { etat: EtatDemo }) {
  const total = score(etat);
  const grade = gradePour(total);
  const lus = indicesLus(etat);
  const trouve = coupableTrouve(etat);
  const vue = useRef(false);

  // une seule mesure par affichage, avec le score au moment de l'ouverture
  useEffect(() => {
    if (vue.current) return;
    vue.current = true;
    track("solution_vue", { score: total, grade: grade.nom });
  }, [total, grade.nom]);

  return (
    <article className="solution" aria-labelledby="solution-titre">
      <header className="solution__tete">
        <p className="solution__surtitre">Bureau Vermillon · Dossier HOT-00 · Enveloppe C</p>
        <h1 id="solution-titre" className="solution__titre">
          La solution
        </h1>
      </header>

      <section className="bareme" aria-labelledby="bareme-titre">
        <h2 id="bareme-titre" className="solution__h2">
          1. Le barème
        </h2>
        <p className="bareme__consigne">
          Comptez vos points d&apos;après ce que vous avez écrit sur la grille <b>avant</b> d&apos;ouvrir cette enveloppe.
        </p>

        <ul className="bareme__lignes">
          {BAREME.lignes.map((l) => {
            const auto = l.cle === "coupable";
            const coche = auto ? trouve : !!etat.bareme[l.cle];
            const reponse = ecrit(etat, l);
            return (
              <li key={l.cle} className={`bareme__ligne${coche ? " est-coche" : ""}`}>
                <input
                  id={`bareme-${l.cle}`}
                  type="checkbox"
                  checked={coche}
                  disabled={auto}
                  onChange={(e) => dispatch({ type: "bareme", cle: l.cle, valeur: e.target.checked })}
                  aria-describedby={`bareme-${l.cle}-ecrit`}
                />
                <label htmlFor={`bareme-${l.cle}`} className="bareme__texte">
                  {l.texte}
                </label>
                <span className="bareme__points">
                  {l.points} pt{l.points > 1 ? "s" : ""}
                </span>
                <p id={`bareme-${l.cle}-ecrit`} className="bareme__ecrit">
                  {auto ? (
                    <>
                      {trouve ? "Coché d'office" : "Non coché"} : votre vérification au registre, § {etat.verificationActe2}.
                      {reponse && <> Votre accusation : « {reponse} ».</>}
                    </>
                  ) : reponse ? (
                    <>Vous avez écrit : « {reponse} »</>
                  ) : (
                    "Vous n'avez rien écrit ici."
                  )}
                </p>
              </li>
            );
          })}
          <li className="bareme__ligne bareme__ligne--retrait">
            <span className="bareme__texte">
              {BAREME.retrait}
              <br />
              Indices à l&apos;envers lus : {lus}
            </span>
            <span className="bareme__points">−{lus} pt{lus > 1 ? "s" : ""}</span>
          </li>
        </ul>

        <div className="bareme__total" aria-live="polite">
          <p className="bareme__score">
            <span className="bareme__chiffre">{total}</span> / {TOTAL_POSSIBLE}
          </p>
          <p className="bareme__grade">{grade.nom.replace(/\.$/, "")}</p>
          <p className="bareme__phrase">{grade.phrase}</p>
        </div>

        <table className="bareme__grades">
          <caption className="sr-only">Table des grades</caption>
          <thead>
            <tr>
              <th scope="col">Score</th>
              <th scope="col">Grade</th>
            </tr>
          </thead>
          <tbody>
            {GRADES.map((g) => (
              <tr key={g.nom} className={g === grade ? "est-actif" : undefined} aria-current={g === grade ? "true" : undefined}>
                <td>
                  {g.min} à {g.max}
                </td>
                <td>
                  <b>{g.nom}</b> {g.phrase}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="solution__feuilles">
        <section className="feuille-solution" aria-labelledby="recit-titre">
          <h2 id="recit-titre" className="feuille-solution__h2">
            2. Le récit
          </h2>
          {RECIT.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </section>

        <section className="feuille-solution" aria-labelledby="reconstitution-titre">
          <h2 id="reconstitution-titre" className="feuille-solution__h2">
            3. La reconstitution
          </h2>
          <table className="reconstitution">
            <thead>
              <tr>
                <th scope="col">Étape</th>
                <th scope="col">Pièces</th>
                <th scope="col">Ce qu&apos;on en tire</th>
              </tr>
            </thead>
            <tbody>
              {RECONSTITUTION.map((r) => (
                <tr key={r.etape} className={r.fort ? "est-fort" : undefined}>
                  <th scope="row" data-libelle="Étape">
                    {r.etape}
                  </th>
                  <td data-libelle="Pièces">{r.pieces}</td>
                  <td data-libelle="Ce qu'on en tire">{r.tire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="feuille-solution" aria-labelledby="innocents-titre">
          <h2 id="innocents-titre" className="feuille-solution__h2">
            4. Les innocents
          </h2>
          <ul className="feuille-solution__liste">
            {INNOCENTS.map((i) => (
              <li key={i.nom}>
                <b>{i.nom}</b> {i.texte}
                {i.ecarte && <b> {i.ecarte}</b>}
              </li>
            ))}
          </ul>
          <h2 className="feuille-solution__h2">5. Les fausses pistes</h2>
          {FAUSSES_PISTES.map((f) => (
            <p key={f.titre}>
              <b>{f.titre}</b> {f.texte}
            </p>
          ))}
        </section>

        <section className="feuille-solution" aria-labelledby="epilogue-titre">
          <h2 id="epilogue-titre" className="feuille-solution__h2">
            6. Épilogue
          </h2>
          {EPILOGUE.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="feuille-solution__encadre">
            <b>{ENCADRE}</b>
          </p>
        </section>
      </div>

      <div className="solution__fin">
        <Link className="btn-peinture btn-peinture--large" href="/resultat">
          Voir mon résultat
        </Link>
      </div>
    </article>
  );
}
