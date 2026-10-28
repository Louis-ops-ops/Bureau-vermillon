"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrix, NIVEAUX, type Enquete } from "@/content/catalogue";
import { usePanier } from "@/lib/panier";

/**
 * Carte produit : le key art de l'enquête, le titre en affiche qui mord sur l'image
 * suivi de sa période, les quatre tampons méta, puis le prix et l'action principale.
 */
export function CarteProduit({ enquete, prioritaire = false }: { enquete: Enquete; prioritaire?: boolean }) {
  const { articles, contient, ajouter, retirer } = usePanier();
  const dedans = contient(enquete.slug);

  return (
    <article className="produit" data-flip-id={enquete.slug} data-univers={enquete.univers} aria-labelledby={`produit-${enquete.slug}`}>
      <div className="produit__media">
        <Image
          src={`/img/enquetes/${enquete.slug}.webp`}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          preload={prioritaire}
        />
        <span className="produit__voile" aria-hidden="true" />
      </div>

      <div className="produit__corps">
        <h3 id={`produit-${enquete.slug}`} className="produit__titre">
          {enquete.titre}
          {/* la ligne peut casser après la virgule, jamais dans « Années 70 » */}
          <span className="produit__periode">
            , <span className="produit__date">{enquete.periode}</span>
          </span>
        </h3>
        <p className="produit__pitch">{enquete.pitch}</p>

        <ul className="produit__metas" aria-label="En bref">
          <li className="tampon-meta">
            <b>{enquete.joueurs}</b> joueurs
          </li>
          <li className="tampon-meta">
            <b>{enquete.niveau}/3</b> {NIVEAUX[enquete.niveau]}
          </li>
          <li className="tampon-meta">
            Durée <b>{enquete.duree}</b>
          </li>
          <li className="tampon-meta">
            <b>{enquete.pages}</b>
          </li>
        </ul>

        <div className="produit__achat">
          <p className="produit__prix">{formatPrix(enquete.prix)}</p>
          {/* Même bouton, même place : le focus ne saute pas quand l'état change.
              Hors panier c'est l'action principale (peinture) ; une fois ajouté, il redevient
              un bouton secondaire pour retirer, et l'annonce dessous mène au panier. */}
          <button
            type="button"
            className={`produit__bouton ${dedans ? "btn-tampon produit__bouton--dedans" : "btn-peinture"}`}
            onClick={() => {
              if (articles === null) return; // panier pas encore lu
              if (dedans) retirer(enquete.slug);
              else ajouter(enquete.slug);
            }}
          >
            {dedans ? "Retirer du panier" : "Ajouter au panier"}
          </button>
        </div>
        {/* zone d'annonce présente en permanence : le lecteur d'écran entend l'ajout */}
        <p className="produit__statut" role="status">
          {dedans && (
            <>
              Dans ton panier.{" "}
              <Link className="lien-stylo" href="/panier">
                Voir le panier
              </Link>
            </>
          )}
        </p>
      </div>
    </article>
  );
}
