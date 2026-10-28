"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { enqueteParSlug, formatPrix, NIVEAUX } from "@/content/catalogue";
import { UNIVERS } from "@/content/landing";
import { usePanier } from "@/lib/panier";

const NOM_UNIVERS = Object.fromEntries(UNIVERS.map((u) => [u.id, u.nom]));

/**
 * Panier sobre : pas de scroll animé, gros corps de texte, une seule action forte.
 * La case de renonciation au droit de rétractation est obligatoire avant le paiement
 * (contenu numérique livré immédiatement).
 */
export function Panier() {
  const { articles, retirer } = usePanier();
  const [annonce, setAnnonce] = useState("");
  const [accord, setAccord] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const listeRef = useRef<HTMLUListElement>(null);

  if (articles === null) {
    return (
      <p className="panier__chargement" aria-busy="true">
        Lecture du panier…
      </p>
    );
  }

  const enquetes = articles.map(enqueteParSlug).filter((e) => e !== undefined);
  const total = enquetes.reduce((s, e) => s + e.prix, 0);

  // Après un retrait, le focus va sur le bouton « Retirer » suivant (ou précédent),
  // sinon sur le titre : on ne perd jamais sa place au clavier.
  const retirerArticle = (slug: string, titre: string, index: number) => {
    retirer(slug);
    setAnnonce(`« ${titre} » retirée du panier.`);
    requestAnimationFrame(() => {
      const boutons = listeRef.current?.querySelectorAll<HTMLButtonElement>(".article__retirer");
      const cible = boutons?.[Math.min(index, (boutons?.length ?? 1) - 1)];
      if (cible) cible.focus();
      else document.getElementById("panier-titre")?.focus();
    });
  };

  const payer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accord) {
      setErreur(true);
      document.getElementById("panier-accord")?.focus();
      return;
    }
    setErreur(false);
    setEnvoye(true);
  };

  return (
    <>
      <p className="sr-only" role="status">
        {annonce}
      </p>

      {enquetes.length === 0 ? (
        <div className="panier__vide">
          <p className="panier__vide-titre">
            Ton panier est vide.
          </p>
          <p>Choisis une affaire, elle t&apos;attendra ici.</p>
          <Link className="btn-peinture" href="/enquetes">
            Voir les enquêtes
          </Link>
        </div>
      ) : (
        <div className="panier__grille">
          <section aria-labelledby="panier-articles">
            <h2 id="panier-articles" className="sr-only">
              Enquêtes dans le panier
            </h2>
            <ul className="panier__liste" ref={listeRef}>
              {enquetes.map((e, i) => (
                <li key={e.slug} className="article">
                  <div className="article__visuel">
                    <Image src={`/img/enquetes/${e.slug}.webp`} alt="" fill sizes="160px" />
                  </div>
                  <div className="article__texte">
                    <h3 className="article__titre">{e.titre}</h3>
                    <p className="article__detail">
                      {NOM_UNIVERS[e.univers]}, difficulté {e.niveau}/3 ({NIVEAUX[e.niveau].toLowerCase()})
                    </p>
                    <p className="article__detail">PDF à imprimer, {e.pages}</p>
                  </div>
                  <p className="article__prix">{formatPrix(e.prix)}</p>
                  <button
                    type="button"
                    className="article__retirer"
                    aria-label={`Retirer « ${e.titre} » du panier`}
                    onClick={() => retirerArticle(e.slug, e.titre, i)}
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
            <Link className="lien-stylo panier__continuer" href="/enquetes">
              Continuer mes achats
            </Link>
          </section>

          <aside className="recap" aria-labelledby="recap-titre">
            <h2 id="recap-titre" className="recap__titre">
              Récapitulatif
            </h2>
            <dl className="recap__lignes">
              <div>
                <dt>
                  {enquetes.length} enquête{enquetes.length > 1 ? "s" : ""}
                </dt>
                <dd>{formatPrix(total)}</dd>
              </div>
              <div className="recap__total">
                <dt>Total TTC</dt>
                <dd>{formatPrix(total)}</dd>
              </div>
            </dl>

            {envoye ? (
              <div className="recap__envoye" role="status">
                <p className="recap__envoye-titre">Paiement à brancher</p>
                <p>Cette maquette s&apos;arrête ici : ce bouton ouvrira la page de paiement sécurisée.</p>
              </div>
            ) : (
              <form className="recap__form" noValidate onSubmit={payer}>
                <div className="case">
                  <input
                    id="panier-accord"
                    type="checkbox"
                    checked={accord}
                    onChange={(ev) => {
                      setAccord(ev.target.checked);
                      if (ev.target.checked) setErreur(false);
                    }}
                    aria-invalid={erreur || undefined}
                    aria-describedby={erreur ? "panier-accord-erreur" : undefined}
                    required
                  />
                  <label htmlFor="panier-accord">
                    Je veux recevoir mes dossiers tout de suite et je renonce à mon droit de rétractation de 14 jours dès
                    le téléchargement.
                  </label>
                </div>
                {erreur && (
                  <p id="panier-accord-erreur" className="champ__erreur" role="alert">
                    Coche cette case pour continuer : un fichier téléchargé ne peut pas être rendu.
                  </p>
                )}
                <button className="btn-peinture" type="submit">
                  Payer {formatPrix(total)}
                </button>
                <p className="recap__note">Les liens de téléchargement arrivent à l&apos;écran et par e-mail.</p>
              </form>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
