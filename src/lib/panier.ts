"use client";

import { useSyncExternalStore } from "react";
import { enqueteParSlug } from "@/content/catalogue";

// Panier côté navigateur : une liste de slugs dans localStorage.
// Un PDF ne s'achète qu'une fois, donc pas de quantité : une enquête y est ou n'y est pas.

const CLE = "panier-enquetes";
const VIDE: string[] = [];
const ecouteurs = new Set<() => void>();

let brut: string | null = null;
let cache: string[] = VIDE;
/** copie en mémoire, seule source quand le stockage est bloqué (navigation privée stricte) */
let memoire: string | null = null;

function lire(): string[] {
  let valeur = memoire;
  try {
    valeur = window.localStorage.getItem(CLE);
  } catch {
    // stockage bloqué : on garde la copie en mémoire, le panier vit le temps de la page
  }
  if (valeur === brut) return cache;
  brut = valeur;
  try {
    const liste = JSON.parse(valeur ?? "[]");
    // on ne garde que les enquêtes qui existent encore au catalogue
    cache = Array.isArray(liste) ? liste.filter((s): s is string => typeof s === "string" && !!enqueteParSlug(s)) : VIDE;
  } catch {
    cache = VIDE;
  }
  return cache;
}

function ecrire(liste: string[]) {
  memoire = JSON.stringify(liste);
  try {
    window.localStorage.setItem(CLE, memoire);
  } catch {
    // pas de persistance, mais l'état en mémoire suffit pour finir l'achat
  }
  ecouteurs.forEach((f) => f());
}

function abonner(f: () => void) {
  ecouteurs.add(f);
  // un autre onglet a modifié le panier
  const surStockage = (e: StorageEvent) => e.key === CLE && f();
  window.addEventListener("storage", surStockage);
  return () => {
    ecouteurs.delete(f);
    window.removeEventListener("storage", surStockage);
  };
}

/**
 * `null` tant que le navigateur n'a pas lu le panier (rendu serveur, hydratation) :
 * les pages affichent un état de chargement plutôt qu'un faux « panier vide ».
 */
export function usePanier() {
  const articles = useSyncExternalStore<string[] | null>(abonner, lire, () => null);
  return {
    articles,
    contient: (slug: string) => !!articles?.includes(slug),
    ajouter: (slug: string) => {
      const liste = lire();
      if (!liste.includes(slug)) ecrire([...liste, slug]);
    },
    retirer: (slug: string) => ecrire(lire().filter((s) => s !== slug)),
  };
}
