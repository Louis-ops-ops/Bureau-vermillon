// Le registre : on n'y entre que par un numéro. Cette fonction décide de ce que le joueur voit,
// sans rien afficher elle-même. Les données arrivent par import dynamique (voir PanneauRegistre).
import { accusationSignee, estVerification, type EtatDemo } from "./etat";

export type TypeParagraphe = "juste" | "faux" | "leurre" | "indice" | "indice-final";

export interface Paragraphe {
  n: number;
  type: TypeParagraphe;
  t: string;
  renvoi?: number;
  teteBeche?: boolean;
  effet?: "ouvrirEnveloppeA" | "verificationActe2";
}

export interface DonneesRegistre {
  registre: Paragraphe[];
  indices: Paragraphe[];
}

export type Reponse =
  | { cas: "hors-plage" }
  | { cas: "inexistant"; n: number }
  | { cas: "non-signee"; n: number }
  | { cas: "deja-verifie"; n: number }
  | { cas: "paragraphe"; p: Paragraphe };

export const PARAGRAPHE_MIN = 100;
export const PARAGRAPHE_MAX = 999;

export function trouver(donnees: DonneesRegistre, n: number) {
  return donnees.registre.find((p) => p.n === n) ?? donnees.indices.find((p) => p.n === n);
}

export function consulter(n: number, etat: EtatDemo, donnees: DonneesRegistre): Reponse {
  if (!Number.isInteger(n) || n < PARAGRAPHE_MIN || n > PARAGRAPHE_MAX) return { cas: "hors-plage" };

  if (estVerification(n)) {
    if (!accusationSignee(etat)) return { cas: "non-signee", n };
    // une seule vérification : on peut relire celle qu'on a faite, pas en tenter une autre
    if (etat.verificationActe2 !== undefined && etat.verificationActe2 !== n) return { cas: "deja-verifie", n };
  }

  const p = trouver(donnees, n);
  return p ? { cas: "paragraphe", p } : { cas: "inexistant", n };
}

/** Rendu du renvoi, retiré du texte : § < 500 = registre, § ≥ 500 = livret d'indices. */
export function libelleRenvoi(p: Paragraphe) {
  if (p.renvoi === undefined) return null;
  return p.n < 500 ? `→ Indice § ${p.renvoi}` : `Toujours bloqués ? → § ${p.renvoi}`;
}
