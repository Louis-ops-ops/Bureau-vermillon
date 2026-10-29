// Polices manuscrites des pièces HOT-00, les mêmes que travail/build.py (PDF imprimés).
// Chargées sur la seule route /gratuit/jouer ; jamais dans l'interface du site.
import { Homemade_Apple, La_Belle_Aurore, Monsieur_La_Doulaise, Reenie_Beanie } from "next/font/google";

/** Signature A (P01, ch. 7) */
const belle = La_Belle_Aurore({ weight: "400", subsets: ["latin"], variable: "--police-belle", display: "block" });
/** Signature C (P06), en-tête du Domaine Delaroche */
const doulaise = Monsieur_La_Doulaise({ weight: "400", subsets: ["latin"], variable: "--police-doulaise", display: "block" });
/** Signature B (P01, ch. 12) et R. Vidal */
const homemade = Homemade_Apple({ weight: "400", subsets: ["latin"], variable: "--police-homemade", display: "block" });
/** Annotations manuscrites, visas, signatures des témoins */
const reenie = Reenie_Beanie({ weight: "400", subsets: ["latin"], variable: "--police-reenie", display: "block" });

export const policesDossier = [belle, doulaise, homemade, reenie].map((p) => p.variable).join(" ");
