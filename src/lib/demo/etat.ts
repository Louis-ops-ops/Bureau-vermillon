// État de la démo HOT-00 : types, reducer pur et valeurs dérivées.
// Aucune dépendance au navigateur : le stockage vit dans store.ts, les tests importent ce fichier seul.

export type Etape = "intro" | "regles" | "acte1" | "enveloppeA" | "acte2" | "enveloppeC" | "solution";

const ORDRE: Etape[] = ["intro", "regles", "acte1", "enveloppeA", "acte2", "enveloppeC", "solution"];

export interface Accusation {
  coupable?: number;
  vraiment?: string;
  cherchait?: string;
  comment?: string;
  pieces?: string;
  /** le nombre ajouté à la base : « § 300 + nombre = § calcul » */
  nombre?: string;
  calcul?: string;
  /** timestamp ; présent = accusation verrouillée */
  signeeA?: number;
}

export interface Grille {
  suspects: Record<number, boolean>;
  vraiment: Record<number, string>;
  /** « § 100 + nombre = § calcul » : le joueur remplit les deux, rien n'est calculé pour lui */
  acte1: { n1?: string; n2?: string; nombre?: string; calcul?: string };
  accusation: Accusation;
  notes: string;
}

export interface EtatDemo {
  version: 2;
  etape: Etape;
  /** timestamp du premier écran d'intro */
  debut: number;
  finActe1?: number;
  /** moment de la vérification de l'acte 2 */
  finActe2?: number;
  /** pièces déjà ouvertes : retire le tampon NOUVEAU */
  piecesOuvertes: string[];
  /** historique des § ouverts, ordre chronologique */
  paragraphesLus: number[];
  tetesBecheRetournees: number[];
  grille: Grille;
  /** 301 à 307, une seule fois */
  verificationActe2?: number;
  /** cases du barème cochées par le joueur */
  bareme: Record<string, boolean>;
}

export const PARAGRAPHE_ACTE1 = 156;
export const PARAGRAPHE_COUPABLE = 305;
export const VERIFICATION_MIN = 301;
export const VERIFICATION_MAX = 307;
/** indices imprimés tête-bêche : chacun coûte 1 point, une seule fois */
export const INDICES_FINAUX = [537, 572, 618, 649, 684];

export const estVerification = (n: number) => n >= VERIFICATION_MIN && n <= VERIFICATION_MAX;

export type Action =
  | { type: "demarrer"; now: number }
  | { type: "aller"; etape: Etape }
  | { type: "ouvrirPiece"; id: string }
  | { type: "lire"; n: number; now: number }
  | { type: "retourner"; n: number; now: number }
  | { type: "suspect"; n: number; valeur: boolean }
  | { type: "vraimentNom"; n: number; texte: string }
  | { type: "acte1"; champ: keyof Grille["acte1"]; valeur: string }
  | { type: "accusation"; champ: Exclude<keyof Accusation, "signeeA" | "coupable">; valeur: string }
  | { type: "coupable"; n: number | undefined }
  | { type: "notes"; texte: string }
  | { type: "signer"; now: number }
  | { type: "bareme"; cle: string; valeur: boolean };

export function etatInitial(now: number): EtatDemo {
  return {
    version: 2,
    etape: "intro",
    debut: now,
    piecesOuvertes: [],
    paragraphesLus: [],
    tetesBecheRetournees: [],
    grille: { suspects: {}, vraiment: {}, acte1: {}, accusation: {}, notes: "" },
    bareme: {},
  };
}

export const acte1Valide = (e: EtatDemo) => e.tetesBecheRetournees.includes(PARAGRAPHE_ACTE1);
export const accusationSignee = (e: EtatDemo) => e.grille.accusation.signeeA !== undefined;
export const verificationFaite = (e: EtatDemo) => e.verificationActe2 !== undefined;

/** Garde-fous : pas d'enveloppe A sans le § 156 retourné, pas d'enveloppe C sans vérification. */
export function prerequisOk(e: EtatDemo, etape: Etape) {
  if (etape === "enveloppeA" || etape === "acte2") return acte1Valide(e);
  if (etape === "enveloppeC" || etape === "solution") return verificationFaite(e);
  return true;
}

/** On n'avance que vers l'avant, et seulement si les prérequis sont remplis. */
export function peutAller(e: EtatDemo, etape: Etape) {
  return ORDRE.indexOf(etape) >= ORDRE.indexOf(e.etape) && prerequisOk(e, etape);
}

const ajouter = <T,>(liste: T[], v: T) => (liste.includes(v) ? liste : [...liste, v]);

function avecAccusation(e: EtatDemo, patch: Partial<Accusation>): EtatDemo {
  // une accusation signée est en lecture seule
  if (accusationSignee(e)) return e;
  return { ...e, grille: { ...e.grille, accusation: { ...e.grille.accusation, ...patch } } };
}

export function reducer(e: EtatDemo | null, a: Action): EtatDemo | null {
  if (a.type === "demarrer") return e ?? etatInitial(a.now);
  if (!e) return e;

  switch (a.type) {
    case "aller":
      return peutAller(e, a.etape) ? { ...e, etape: a.etape } : e;

    case "ouvrirPiece":
      return e.piecesOuvertes.includes(a.id) ? e : { ...e, piecesOuvertes: [...e.piecesOuvertes, a.id] };

    case "lire": {
      const suivant = { ...e, paragraphesLus: [...e.paragraphesLus, a.n] };
      // le premier § 301-307 lu après la signature est LA vérification
      if (estVerification(a.n) && accusationSignee(e) && !verificationFaite(e)) {
        return { ...suivant, verificationActe2: a.n, finActe2: a.now };
      }
      return suivant;
    }

    case "retourner": {
      const suivant = { ...e, tetesBecheRetournees: ajouter(e.tetesBecheRetournees, a.n) };
      if (a.n === PARAGRAPHE_ACTE1 && e.finActe1 === undefined) return { ...suivant, finActe1: a.now };
      return suivant;
    }

    case "suspect":
      return { ...e, grille: { ...e.grille, suspects: { ...e.grille.suspects, [a.n]: a.valeur } } };

    case "vraimentNom":
      return { ...e, grille: { ...e.grille, vraiment: { ...e.grille.vraiment, [a.n]: a.texte } } };

    case "acte1":
      return { ...e, grille: { ...e.grille, acte1: { ...e.grille.acte1, [a.champ]: a.valeur } } };

    case "accusation":
      // le calcul du § n'est pas l'accusation : il reste modifiable après la signature
      if (a.champ === "nombre" || a.champ === "calcul") {
        return { ...e, grille: { ...e.grille, accusation: { ...e.grille.accusation, [a.champ]: a.valeur } } };
      }
      return avecAccusation(e, { [a.champ]: a.valeur });

    case "coupable":
      return avecAccusation(e, { coupable: a.n });

    case "notes":
      return { ...e, grille: { ...e.grille, notes: a.texte } };

    case "signer":
      if (accusationSignee(e) || e.grille.accusation.coupable === undefined) return e;
      return avecAccusation(e, { signeeA: a.now });

    case "bareme":
      return { ...e, bareme: { ...e.bareme, [a.cle]: a.valeur } };
  }
}

/**
 * Relit un état venu du stockage. Tout ce qui ne ressemble pas à une partie v2 est jeté ;
 * une étape dont les prérequis manquent (stockage modifié à la main) redescend à la dernière possible.
 */
export function normaliser(brut: unknown): EtatDemo | null {
  if (!brut || typeof brut !== "object") return null;
  const e = brut as Partial<EtatDemo>;
  if (e.version !== 2 || typeof e.debut !== "number" || !ORDRE.includes(e.etape as Etape)) return null;
  if (!Array.isArray(e.piecesOuvertes) || !Array.isArray(e.paragraphesLus) || !Array.isArray(e.tetesBecheRetournees)) return null;
  if (!e.grille || typeof e.grille !== "object" || !e.bareme || typeof e.bareme !== "object") return null;

  const base = etatInitial(e.debut).grille;
  const g = e.grille as Partial<Grille>;
  let etat: EtatDemo = {
    ...(e as EtatDemo),
    grille: {
      suspects: g.suspects ?? base.suspects,
      vraiment: g.vraiment ?? base.vraiment,
      acte1: g.acte1 ?? base.acte1,
      accusation: g.accusation ?? base.accusation,
      notes: typeof g.notes === "string" ? g.notes : "",
    },
  };
  if (etat.verificationActe2 !== undefined && !estVerification(etat.verificationActe2)) {
    etat = { ...etat, verificationActe2: undefined };
  }
  if (!prerequisOk(etat, etat.etape)) {
    etat = { ...etat, etape: acte1Valide(etat) ? "acte2" : "acte1" };
  }
  return etat;
}

/* ---------- Barème (points seulement : les libellés sont dans la solution, chargée à part) ---------- */

export const POINTS_BAREME: Record<string, number> = {
  coupable: 3,
  vraiment: 2,
  cherchait: 2,
  "comment-cle": 1,
  "comment-butin": 1,
  "piece-p06": 1,
  "piece-jd": 1,
  "piece-p04": 1,
};
export const TOTAL_POSSIBLE = 12;

export const indicesLus = (e: EtatDemo) => e.tetesBecheRetournees.filter((n) => INDICES_FINAUX.includes(n)).length;
export const coupableTrouve = (e: EtatDemo) => e.verificationActe2 === PARAGRAPHE_COUPABLE;

/** Somme des lignes cochées − indices tête-bêche lus, plancher 0. La ligne « coupable » suit la vérification. */
export function score(e: EtatDemo) {
  let total = coupableTrouve(e) ? POINTS_BAREME.coupable : 0;
  for (const [cle, points] of Object.entries(POINTS_BAREME)) {
    if (cle !== "coupable" && e.bareme[cle]) total += points;
  }
  return Math.max(0, total - indicesLus(e));
}

/** Durée de la partie en millisecondes : du premier écran d'intro à la vérification. */
export const duree = (e: EtatDemo) => (e.finActe2 ?? e.debut) - e.debut;
