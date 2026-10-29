// Table des grades de l'enveloppe C (enveloppe-c-solution.md, section 1), mot pour mot.
// Séparée de la solution : /resultat en a besoin pour le parcours papier.

export interface Grade {
  min: number;
  max: number;
  nom: string;
  phrase: string;
}

export const GRADES: Grade[] = [
  {
    min: 11,
    max: 12,
    nom: "Commissaire du Bureau Vermillon.",
    phrase: "Une signature, deux initiales, un pli : rien ne vous échappe.",
  },
  { min: 8, max: 10, nom: "Inspecteur principal.", phrase: "Le coupable est sous clé ; sa famille vous a résisté." },
  { min: 5, max: 7, nom: "Enquêteur stagiaire.", phrase: "Vous teniez le bon fil, sans tout tirer." },
  { min: 0, max: 4, nom: "Veilleur de nuit.", phrase: "« Personne n'a jamais rien volé pendant ma ronde. »" },
];

export function gradePour(score: number): Grade {
  return GRADES.find((g) => score >= g.min && score <= g.max) ?? GRADES[GRADES.length - 1];
}

/** Le nom sans son point final, pour un titre ou un libellé de liste. */
export const nomCourt = (g: Grade) => g.nom.replace(/\.$/, "");
