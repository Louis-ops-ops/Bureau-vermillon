"use client";

import { useState, useSyncExternalStore } from "react";
import { consulter, type DonneesRegistre, type Reponse } from "@/lib/demo/registre";
import { dispatch, etatCourant } from "@/lib/demo/store";

// Les paragraphes arrivent par import dynamique, une seule fois pour toute la page :
// rien n'est dans le bundle principal ni dans le HTML.
let donnees: DonneesRegistre | null = null;
let chargement: Promise<void> | null = null;
const abonnes = new Set<() => void>();

function charger() {
  chargement ??= import("@/content/demo/hot-00/registre.json").then((m) => {
    donnees = m.default as DonneesRegistre;
    abonnes.forEach((f) => f());
  });
}

export function useDonneesRegistre() {
  return useSyncExternalStore(
    (f) => {
      abonnes.add(f);
      charger();
      return () => abonnes.delete(f);
    },
    () => donnees,
    () => null,
  );
}

export interface Lecture {
  /** change à chaque ouverture : rejoue l'annonce et l'apparition même pour le même § */
  cle: number;
  reponse: Reponse;
  retourne: boolean;
}

/** Ce que le registre affiche en ce moment. La réponse est figée à l'ouverture, comme une page qu'on lit. */
export function useLecteurRegistre() {
  const data = useDonneesRegistre();
  const [lecture, setLecture] = useState<Lecture | null>(null);

  const ouvrir = (n: number) => {
    const etat = etatCourant();
    if (!data || !etat) return;
    const reponse = consulter(n, etat, data);
    if (reponse.cas === "paragraphe") dispatch({ type: "lire", n, now: Date.now() });
    setLecture((l) => ({ cle: (l?.cle ?? 0) + 1, reponse, retourne: false }));
  };

  const retourner = () => {
    if (lecture?.reponse.cas !== "paragraphe") return;
    dispatch({ type: "retourner", n: lecture.reponse.p.n, now: Date.now() });
    setLecture({ ...lecture, retourne: true });
  };

  return { pret: !!data, lecture, ouvrir, retourner };
}

export type LecteurRegistre = ReturnType<typeof useLecteurRegistre>;
