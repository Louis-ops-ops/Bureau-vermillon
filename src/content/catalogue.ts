// Les enquêtes en vente. Une entrée = une carte produit dans /enquetes.
// Le visuel est dans public/img/enquetes/<slug>.webp (source : ../webp/enquetes).

import { DUREE, type UniversId } from "@/content/landing";

/** Prix de maquette validé (14,90 €) : à remplacer par le vrai prix, en centimes. */
export const PRIX_CENTIMES = 1490;

/** Nombre de pages à imprimer : à remplir enquête par enquête une fois les dossiers écrits. */
export const PAGES_A_IMPRIMER = "[Pages à imprimer]";

export type Niveau = 1 | 2 | 3;

export const NIVEAUX: Record<Niveau, string> = {
  1: "Accessible",
  2: "Intermédiaire",
  3: "Corsé",
};

export type Enquete = {
  slug: string;
  titre: string;
  /** Affichée dans le titre, sous le nom de l'enquête. */
  periode: string;
  univers: UniversId;
  niveau: Niveau;
  pitch: string;
  prix: number;
  joueurs: string;
  duree: string;
  pages: string;
};

export const ENQUETES: Enquete[] = [
  {
    slug: "derniere-tournee",
    titre: "Dernière tournée",
    periode: "Années 70",
    univers: "policier",
    niveau: 3,
    pitch: "Un habitué du Cyrano retrouvé dans la cour. Trois témoins, trois versions.",
    prix: PRIX_CENTIMES,
    joueurs: "1 à 6",
    duree: DUREE,
    pages: PAGES_A_IMPRIMER,
  },
  {
    slug: "le-dernier-vol",
    titre: "Le dernier vol",
    periode: "Années 80",
    univers: "narcos",
    niveau: 1,
    pitch: "Sur la piste privée de l'hacienda La Esperanza, l'avion n'a jamais décollé. Son passager non plus.",
    prix: PRIX_CENTIMES,
    joueurs: "1 à 6",
    duree: DUREE,
    pages: PAGES_A_IMPRIMER,
  },
];

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
export const formatPrix = (centimes: number) => euros.format(centimes / 100);

export const enqueteParSlug = (slug: string) => ENQUETES.find((e) => e.slug === slug);
