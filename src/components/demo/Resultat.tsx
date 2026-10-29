"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { GRADES, gradePour, nomCourt, type Grade } from "@/content/demo/hot-00/grades";
import { coupableTrouve, duree, indicesLus, score, TOTAL_POSSIBLE, type EtatDemo } from "@/lib/demo/etat";
import { reinitialiser, useDemo } from "@/lib/demo/store";
import { track } from "@/lib/demo/track";
import { CaptureEmail } from "./CaptureEmail";
import { Disclaimer } from "./Disclaimer";
import { Confirmation } from "./Modale";

function formatDuree(ms: number) {
  const min = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return min ? `${min} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

/**
 * Fin des deux parcours. Avec une partie en ligne terminée : le résultat. Sans état (joueur papier
 * arrivé par le QR code de l'enveloppe C, ou lien direct) : il déclare son résultat. Rien n'est envoyé.
 */
export function Resultat() {
  const etat = useDemo();
  if (etat === undefined) return <div className="resultat__attente" aria-busy="true" />;
  const termine = etat?.etape === "solution";

  return (
    <>
      {termine ? <ResultatEnLigne etat={etat} /> : <Declaration enCours={!!etat} />}
      <LaSuite rejouer={termine} />
    </>
  );
}

function ResultatEnLigne({ etat }: { etat: EtatDemo }) {
  const total = score(etat);
  const grade = gradePour(total);
  return (
    <section className="wrap resultat__tete" aria-labelledby="resultat-titre">
      <p className="resultat__surtitre">Dossier HOT-00 · Le palace d&apos;azur</p>
      <h1 id="resultat-titre" className="resultat__titre">
        Affaire classée
      </h1>
      <div className="resultat__grade">
        <p className="resultat__grade-nom">{nomCourt(grade)}</p>
        <p className="resultat__phrase">{grade.phrase}</p>
      </div>
      <dl className="resultat__chiffres">
        <div>
          <dt>Score</dt>
          <dd>
            <b>{total}</b> / {TOTAL_POSSIBLE}
          </dd>
        </div>
        <div>
          <dt>Durée</dt>
          <dd>
            <b>{formatDuree(duree(etat))}</b>
          </dd>
        </div>
        <div>
          <dt>Indices à l&apos;envers lus</dt>
          <dd>
            <b>{indicesLus(etat)}</b>
          </dd>
        </div>
        <div>
          <dt>Coupable trouvé</dt>
          <dd>
            <b>{coupableTrouve(etat) ? "Oui" : "Non"}</b>
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Declaration({ enCours }: { enCours: boolean }) {
  const id = useId();
  const [declare, setDeclare] = useState<Grade | null>(null);

  const declarer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const donnees = new FormData(e.currentTarget);
    const grade = GRADES[Number(donnees.get("grade"))];
    track("resultat_declare", { coupable: donnees.get("coupable") === "oui", grade: grade.nom });
    setDeclare(grade);
  };

  if (declare) {
    return (
      <section className="wrap resultat__tete" aria-labelledby="merci-titre">
        <p className="resultat__surtitre">Dossier HOT-00 · Le palace d&apos;azur</p>
        <h1 id="merci-titre" className="resultat__titre" tabIndex={-1}>
          Merci, enquêteur
        </h1>
        <div className="resultat__grade">
          <p className="resultat__grade-nom">{nomCourt(declare)}</p>
          <p className="resultat__phrase">{declare.phrase}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap resultat__tete" aria-labelledby="declarer-titre">
      <p className="resultat__surtitre">Dossier HOT-00 · Le palace d&apos;azur</p>
      <h1 id="declarer-titre" className="resultat__titre">
        Déclarez votre résultat
      </h1>
      {enCours && (
        <p className="resultat__reprendre">
          Une partie en ligne est en cours.{" "}
          <Link className="lien-stylo" href="/gratuit/jouer">
            Reprendre l&apos;enquête
          </Link>
        </p>
      )}
      <form className="declaration" onSubmit={declarer}>
        <fieldset className="declaration__groupe">
          <legend>Avez-vous trouvé le coupable ?</legend>
          <div className="declaration__choix">
            {["oui", "non"].map((v) => (
              <label key={v} className="declaration__option">
                <input type="radio" name="coupable" value={v} required />
                {v === "oui" ? "Oui" : "Non"}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="declaration__groupe">
          <legend>Votre grade</legend>
          <div className="declaration__grades">
            {GRADES.map((g, i) => (
              <label key={g.nom} className="declaration__option" htmlFor={`${id}-grade-${i}`}>
                <input id={`${id}-grade-${i}`} type="radio" name="grade" value={i} required />
                <span>
                  {nomCourt(g)} <span className="declaration__points">{g.min} à {g.max} points</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <button type="submit" className="btn-tampon">
            Déclarer mon résultat
          </button>
        </div>
      </form>
    </section>
  );
}

function LaSuite({ rejouer }: { rejouer: boolean }) {
  const router = useRouter();
  const [confirmer, setConfirmer] = useState(false);
  return (
    <>
      <section className="wrap la-suite" aria-labelledby="suite-titre">
        <figure className="la-suite__visuel">
          <Image src="/img/enquete-table-joueurs.webp" alt="Six joueurs penchés sur des documents étalés autour d'une table, sous une lampe suspendue." width={1920} height={1075} sizes="(min-width: 1024px) 50vw, 100vw" loading="lazy" />
        </figure>
        <div className="la-suite__texte">
          <h2 id="suite-titre" className="la-suite__titre">
            La suite
          </h2>
          <p className="la-suite__chapo">
            Les vraies enquêtes se jouent à plusieurs, autour d&apos;une table. Un dossier imprimé, des enveloppes scellées, une soirée entière.
          </p>
          <Disclaimer />
          <div className="la-suite__cta">
            <Link className="btn-peinture btn-peinture--large" href="/enquetes">
              Voir les enquêtes
            </Link>
          </div>
          <CaptureEmail />
          {rejouer && (
            <p className="la-suite__rejouer">
              <button type="button" className="lien-stylo" onClick={() => setConfirmer(true)}>
                Rejouer la démo
              </button>
            </p>
          )}
        </div>
      </section>
      <Confirmation
        ouverte={confirmer}
        titre="Rejouer la démo ?"
        texte="Votre partie, votre grille et votre score seront effacés. Le chrono repart de zéro."
        confirmer="Rejouer"
        onConfirmer={() => {
          reinitialiser();
          router.push("/gratuit/jouer");
        }}
        onAnnuler={() => setConfirmer(false)}
      />
    </>
  );
}
