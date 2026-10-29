"use client";

import { useSyncExternalStore } from "react";
import { DOSSIER } from "@/content/demo/hot-00/dossier";
import { normaliser, reducer, type Action, type EtatDemo } from "./etat";
import { track } from "./track";

// Une seule source d'état pour la démo, persistée en localStorage (même logique que le panier).
// Stockage bloqué ou corrompu : la partie continue en mémoire, le temps de la page.

const ecouteurs = new Set<() => void>();
let stockageOk = true;
let memoire: string | null = null;
let brut: string | null | undefined;
let cache: EtatDemo | null = null;

function lireBrut(): string | null {
  if (stockageOk) {
    try {
      return window.localStorage.getItem(DOSSIER.cle);
    } catch {
      stockageOk = false;
    }
  }
  return memoire;
}

function ecrireBrut(valeur: string | null) {
  memoire = valeur;
  if (!stockageOk) return;
  try {
    if (valeur === null) window.localStorage.removeItem(DOSSIER.cle);
    else window.localStorage.setItem(DOSSIER.cle, valeur);
  } catch {
    // quota plein ou stockage interdit : on bascule en mémoire pour de bon
    stockageOk = false;
  }
}

function lire(): EtatDemo | null {
  const valeur = lireBrut();
  if (valeur === brut) return cache;
  brut = valeur;
  try {
    cache = valeur ? normaliser(JSON.parse(valeur)) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function prevenir() {
  ecouteurs.forEach((f) => f());
}

function abonner(f: () => void) {
  ecouteurs.add(f);
  // la partie a avancé dans un autre onglet
  const surStockage = (e: StorageEvent) => e.key === DOSSIER.cle && f();
  window.addEventListener("storage", surStockage);
  return () => {
    ecouteurs.delete(f);
    window.removeEventListener("storage", surStockage);
  };
}

/** Les événements de mesure se déduisent du passage d'un état à l'autre. */
function mesurer(avant: EtatDemo | null, apres: EtatDemo, a: Action) {
  if (!avant) return track("demo_start");
  if (a.type === "lire") track("paragraphe_ouvert", { n: a.n });
  if (a.type === "retourner" && !avant.tetesBecheRetournees.includes(a.n)) track("tete_beche_retournee", { n: a.n });
  if (avant.finActe1 === undefined && apres.finActe1 !== undefined) track("acte1_valide", { duree: apres.finActe1 - apres.debut });
  if (avant.grille.accusation.signeeA === undefined && apres.grille.accusation.signeeA !== undefined) track("accusation_signee");
  if (avant.verificationActe2 === undefined && apres.verificationActe2 !== undefined) {
    track("verification_acte2", { n: apres.verificationActe2 });
  }
}

export function dispatch(a: Action) {
  const avant = lire();
  const apres = reducer(avant, a);
  if (!apres || apres === avant) return;
  ecrireBrut(JSON.stringify(apres));
  mesurer(avant, apres, a);
  prevenir();
}

export function reinitialiser() {
  ecrireBrut(null);
  prevenir();
}

/** Lecture ponctuelle hors rendu (gestionnaires d'événements). */
export const etatCourant = () => lire();

/**
 * `undefined` tant que le navigateur n'a pas lu le stockage (rendu serveur, hydratation),
 * `null` s'il n'y a pas de partie, sinon l'état.
 */
export function useDemo(): EtatDemo | null | undefined {
  return useSyncExternalStore<EtatDemo | null | undefined>(abonner, lire, () => undefined);
}

/* ---------- Petits magasins navigateur : media query et horloge ---------- */

export function useMedia(requete: string) {
  return useSyncExternalStore(
    (f) => {
      const mq = window.matchMedia(requete);
      mq.addEventListener("change", f);
      return () => mq.removeEventListener("change", f);
    },
    () => window.matchMedia(requete).matches,
    () => false,
  );
}

const tic = new Set<() => void>();
let minuteur: number | undefined;
let maintenant = 0;

/** L'heure, rafraîchie chaque seconde tant qu'un composant l'écoute (le chrono). */
export function useHorloge() {
  return useSyncExternalStore(
    (f) => {
      tic.add(f);
      if (minuteur === undefined) {
        maintenant = Date.now();
        minuteur = window.setInterval(() => {
          maintenant = Date.now();
          tic.forEach((g) => g());
        }, 1000);
      }
      return () => {
        tic.delete(f);
        if (!tic.size) {
          window.clearInterval(minuteur);
          minuteur = undefined;
        }
      };
    },
    () => (maintenant ||= Date.now()),
    () => 0,
  );
}
