// Démo HOT-00 « Le palace d'azur » : tout ce qui peut être dans le bundle principal sans rien dévoiler.
// Textes mot pour mot depuis sources/ (pieces.md, livrables-joueurs.md) et le brief (section 9).
// Le registre (registre.json) et la solution (solution.ts) sont chargés à part, en import dynamique.

export const DOSSIER = {
  code: "HOT-00",
  titre: "Le palace d'azur",
  /** clé localStorage : le « v2 » suit la version du scénario, on la change avec lui */
  cle: "bv-demo-hot00-v2",
} as const;

/** Numérotation de la grille : ne jamais la changer, les § en dépendent. */
export const NOMS: { n: number; nom: string }[] = [
  { n: 1, nom: "Simone ARNAUD" },
  { n: 2, nom: "Paul BERTIN" },
  { n: 3, nom: "Marcel BONNET" },
  { n: 4, nom: "Henri CASTELLANE" },
  { n: 5, nom: "Antoine DELAROCHE" },
  { n: 6, nom: "Odette FERRAND" },
  { n: 7, nom: "Raymond VIDAL" },
];

export const nomPour = (n: number | undefined) => NOMS.find((x) => x.n === n)?.nom;

/* ---------- Textes fixes (brief, section 9) ---------- */

export const DISCLAIMER =
  "Cette démo se joue à l'écran pour que vous puissiez l'essayer en 20 minutes. Toutes les enquêtes Bureau Vermillon sont des dossiers à imprimer : vous les jouez sur papier, de 1 à 6 joueurs, sans écran.";

export const REGLES = {
  titre: "Comment vérifier une réponse",
  intro:
    "Le registre ne se lit pas comme un livre. Ses paragraphes (§) sont mélangés et beaucoup sont des leurres : on n'y trouve le bon que si l'on a la bonne réponse.",
  etapes: [
    "Trouvez la réponse dans les pièces.",
    "Convertissez-la en nombre avec la règle de la question, puis ajoutez la base.",
    "Ouvrez ce paragraphe dans le registre, et lui seul.",
  ],
  exemple: "Exemple : base 200, personne n° 7 → § 200 + 7 = § 207.",
  bloques:
    "Bloqués ? Chaque question donne un numéro d'indice. Les indices imprimés à l'envers donnent la réponse et coûtent 1 point.",
  exercice: "Essayez : ouvrez le § 207 dans le registre.",
};

export const GARDE_A = { lettre: "A", titre: "Enveloppe A", consigne: "Ne pas ouvrir avant d'avoir validé l'acte 1 au registre." };
export const GARDE_C = {
  lettre: "C",
  titre: "La solution",
  consigne: "Avez-vous écrit et signé votre accusation sur la grille ?",
  sous: "Si ce n'est pas fait, refermez cette enveloppe.",
};

/* ---------- La grille (livrables-joueurs.md, lot 3) ---------- */

export const GRILLE = {
  verifier: {
    titre: "Comment vérifier une réponse",
    etapes: [
      "Trouvez la réponse dans les pièces.",
      "Convertissez-la en nombre avec la règle de la question, puis ajoutez la base.",
      "Lisez ce paragraphe (§) dans le registre, et lui seul.",
    ],
    exemple: "Exemple de calcul : base 200, personne n° 7 → § 200 + 7 = § 207.",
  },
  noms: {
    titre: "Les noms du dossier",
    consigne:
      "Cochez ceux que vous soupçonnez. Dans la dernière colonne, notez qui la personne est vraiment, si elle n'est pas celle qu'elle prétend.",
  },
  acte1: {
    titre: "Acte 1 — Les faits",
    sous: "pièces P00 à P04, environ 9 min",
    question: "Deux clients ont vu où la clé du coffre est rangée la nuit. Lesquels ?",
    aide: "Réponse : deux personnes. Écrivez leurs deux numéros côte à côte, le plus petit d'abord (2 et 5 → 25).",
    base: 100,
    indice: 742,
  },
  acte2: {
    titre: "Acte 2 — L'accusation",
    sous: "enveloppe A, environ 9 min",
    question: "Qui a vidé le coffre ? Qui est-il vraiment, et que cherchait-il ?",
    base: 300,
    indices: [
      { libelle: "Le coupable", n: 865 },
      { libelle: "Qui est-il vraiment", n: 834 },
      { libelle: "L'autre suspecte", n: 791 },
      { libelle: "Le butin", n: 923 },
    ],
    indicesLus: "retirez 1 point chacun dans l'enveloppe C.",
  },
};

/* ---------- Les pièces ---------- */

export type IdPiece = "P00" | "P01" | "P02" | "P03" | "P04" | "P05" | "P06" | "P07";

export interface MetaPiece {
  id: IdPiece;
  acte: 1 | 2;
  titre: string;
}

export const PIECES: MetaPiece[] = [
  { id: "P00", acte: 1, titre: "Intro BD" },
  { id: "P01", acte: 1, titre: "Registre des voyageurs, feuillet du 11 au 13 août" },
  { id: "P02", acte: 1, titre: "Registre des dépôts au coffre" },
  { id: "P03", acte: 1, titre: "Audition de Simone Arnaud" },
  { id: "P04", acte: 1, titre: "Audition de Marcel Bonnet" },
  { id: "P05", acte: 2, titre: "Fiches suspects" },
  { id: "P06", acte: 2, titre: "Lettre de réservation, Domaine Delaroche" },
  { id: "P07", acte: 2, titre: "Lettre du cabinet Lefort & associés" },
];

/* ---------- P00, l'intro BD (pieces.md) ---------- */

const IMG = "/demo/hot-00";

export interface CaseBD {
  src: string;
  largeur: number;
  hauteur: number;
  alt: string;
  recits?: string[];
  bulle?: string;
  /** où poser la bulle sur l'image ; la case 3 garde son tiers droit libre (héros du Bureau, à venir) */
  position?: "haut-gauche" | "bas-droite";
}

export const CASES: CaseBD[] = [
  {
    src: `${IMG}/p00-case-1.webp`,
    largeur: 1024,
    hauteur: 683,
    alt: "Façade d'un grand hôtel blanc sur la Croisette au petit matin, promenade déserte.",
    recits: ["Cannes, 14 août 1956.", "Grand Hôtel Azuréa, sept heures du matin."],
  },
  {
    src: `${IMG}/p00-case-2.webp`,
    largeur: 1024,
    hauteur: 1024,
    alt: "Un coffre-fort ouvert et vide, des écrins de velours vides sur les étagères.",
    bulle: "« Vidé. Les bijoux de mes clients, la recette d'hier… et un pli de banque que je devais remettre en main propre. »",
    position: "bas-droite",
  },
  {
    src: `${IMG}/p00-case-3.webp`,
    largeur: 1024,
    hauteur: 683,
    alt: "Le directeur de l'hôtel, en jaquette sombre, s'adresse à vous dans le hall.",
    bulle:
      "« Personne ne quitte l'hôtel avant que vous ayez trouvé. Ce sont tous mes clients, monsieur… mais l'un d'eux n'est pas celui qu'il prétend être. »",
    position: "haut-gauche",
  },
  {
    src: `${IMG}/p00-case-4.webp`,
    largeur: 1024,
    hauteur: 683,
    alt: "Un dossier fermé par un ruban rouge sur le comptoir de la réception.",
    recits: ["Le Bureau Vermillon vous confie l'affaire.", "Qui a vidé le coffre, qui est-il vraiment, et que cherchait-il ?", "Ouvrez le dossier."],
  },
];

export const PORTRAITS = {
  delaroche: {
    src: `${IMG}/suspect-delaroche.webp`,
    vignette: `${IMG}/suspect-delaroche-480.webp`,
    alt: "Portrait d'un homme d'une trentaine d'années, cheveux bruns plaqués, costume de lin clair, sur une terrasse au bord de la mer.",
  },
  ferrand: {
    src: `${IMG}/suspect-ferrand.webp`,
    vignette: `${IMG}/suspect-ferrand-480.webp`,
    alt: "Portrait d'une femme d'une quarantaine d'années, chignon bas, la main gauche près du col, une alliance à l'annulaire.",
  },
};

/* ---------- Téléchargement ---------- */

export const ZIP = {
  standard: {
    href: `${IMG}/bureau-vermillon-hot-00-le-palace-d-azur.zip`,
    libelle: "Version standard — 6 PDF, 22 pages (ZIP)",
  },
  eco: {
    href: `${IMG}/bureau-vermillon-hot-00-le-palace-d-azur-eco.zip`,
    libelle: "Version éco, fond blanc — moins d'encre (ZIP)",
  },
  note: "A4, taille réelle, recto seul. Le noir et blanc suffit. Prévoyez 2 enveloppes.",
};
