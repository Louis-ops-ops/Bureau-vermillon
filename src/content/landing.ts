// Contenu de la landing. Les valeurs entre crochets sont des placeholders non arbitrés
// (marque, prix, durée) : les remplacer ici, nulle part ailleurs.

export const MARQUE = "[Marque]";
export const DUREE = "[durée]";
export const PAGES = 5;
/** Chiffre de maquette validé : à remplacer par la mesure réelle des codes de solution. */
export const TAUX_RESOLUTION = 40;

export type UniversId = "policier" | "narcos" | "cyberpunk" | "viking" | "hotel" | "chevalier";

export type Univers = {
  id: UniversId;
  nom: string;
  epoque: string;
  pitch: string;
  /** cadrage du key art quand la carte est recadrée (mobile) */
  cadrage: string;
};

// Pitchs provisoires : les enquêtes ne sont pas écrites, ce sont des ambiances, pas des intrigues.
export const UNIVERS: Univers[] = [
  {
    id: "policier",
    nom: "Policier",
    epoque: "Paris, années 70",
    pitch: "Un habitué du Cyrano retrouvé dans la cour. Trois témoins, trois versions.",
    cadrage: "30% center",
  },
  {
    id: "narcos",
    nom: "Narcos",
    epoque: "San Aurelio, années 80",
    pitch: "Un pilote disparu, une mallette vide et un hôtel où personne n'a rien vu.",
    cadrage: "78% center",
  },
  {
    id: "cyberpunk",
    nom: "Cyberpunk",
    epoque: "Néo-Lyon, 2087",
    pitch: "Il pleut depuis dix ans sur la ville basse. Un implant a tout vu, sauf le visage du coupable.",
    cadrage: "22% center",
  },
  {
    id: "viking",
    nom: "Viking",
    epoque: "Fjords, an 900",
    pitch: "Le jarl est mort pendant le festin d'hiver. Personne n'a quitté la halle.",
    cadrage: "58% center",
  },
  {
    id: "hotel",
    nom: "Hôtel",
    epoque: "Riviera, années 30",
    pitch: "Le grand hôtel affiche complet. Le client de la suite 12 ne descendra pas dîner.",
    cadrage: "80% center",
  },
  {
    id: "chevalier",
    nom: "Chevalier",
    epoque: "Bourgogne, 1350",
    pitch: "Le sceau de l'abbaye est brisé et le messager du duc ne repartira pas.",
    cadrage: "94% center",
  },
];

export type Suspect = {
  id: string;
  univers: UniversId;
  nom: string;
  indice: string;
  /** décrit la personne, jamais son rôle dans l'enquête */
  alt: string;
};

export const SUSPECTS: Suspect[] = [
  { id: "policier-veuve", univers: "policier", nom: "La veuve", indice: "gants noirs", alt: "Portrait peint d'une femme en manteau noir et chapeau à voilette, regard de biais." },
  { id: "policier-patron", univers: "policier", nom: "Le patron du bar", indice: "tablier taché", alt: "Portrait peint d'un homme moustachu en chemise claire et tablier, bras le long du corps." },
  { id: "policier-voisin", univers: "policier", nom: "Le voisin", indice: "lunettes épaisses", alt: "Portrait peint d'un homme chauve et maigre en gilet beige, qui ajuste son col." },
  { id: "narcos-pilote", univers: "narcos", nom: "Le pilote", indice: "cicatrice", alt: "Portrait peint d'un homme brun en chemise blanche, un casque d'aviateur sur l'épaule." },
  { id: "narcos-avocat", univers: "narcos", nom: "L'avocat", indice: "montre en or", alt: "Portrait peint d'un homme moustachu en costume blanc, une mallette à la main." },
  { id: "narcos-cousine", univers: "narcos", nom: "La cousine", indice: "créoles dorées", alt: "Portrait peint d'une femme aux cheveux bouclés en chemise rouge, bras croisés." },
  { id: "viking-forgeron", univers: "viking", nom: "Le forgeron", indice: "anneaux", alt: "Portrait peint d'un homme barbu aux cheveux tressés, en tablier de cuir." },
  { id: "viking-skald", univers: "viking", nom: "Le skald", indice: "lyre", alt: "Portrait peint d'un homme blond aux tresses, en tunique bleue, sourire en coin." },
  { id: "viking-volva", univers: "viking", nom: "La völva", indice: "corbeau", alt: "Portrait peint d'une femme âgée aux cheveux blancs, visage peint, un bâton à la main." },
  { id: "chevalier-abbe", univers: "chevalier", nom: "L'abbé", indice: "doigts tachés d'encre", alt: "Portrait peint d'un moine âgé au crâne rasé, en bure brune, les mains jointes." },
  { id: "chevalier-ecuyer", univers: "chevalier", nom: "L'écuyer", indice: "éraflure à la joue", alt: "Portrait peint d'un jeune homme aux cheveux noirs en désordre, en gambison." },
  { id: "chevalier-dame-de-compagnie", univers: "chevalier", nom: "La dame de compagnie", indice: "clé au cou", alt: "Portrait peint d'une jeune femme blonde voilée, en robe rouge, les mains croisées." },
];

export const BANDEAU = [
  "Téléchargement immédiat",
  "1 à 6 joueurs",
  "Sans animateur",
  `${PAGES} pages à imprimer`,
  "Noir et blanc accepté",
  "Solution protégée par un code",
];

export type Question = { q: string; r: string };

export const FAQ: Question[] = [
  {
    q: "J'ai une imprimante noir et blanc. Ça marche ?",
    r: "Oui. Toutes les pièces sont lisibles en noir et blanc. La couleur ajoute de l'ambiance, jamais un indice.",
  },
  {
    q: "Combien de pages faut-il imprimer ?",
    r: `${PAGES} pages A4. Le guide de l'organisateur dit dans quel ordre les sortir et lesquelles glisser sous enveloppe.`,
  },
  {
    q: "Combien de temps dure une partie ?",
    r: `Compte ${DUREE} selon ton groupe. Rien ne presse : le dossier attend sur la table.`,
  },
  {
    q: "Il faut quelqu'un pour animer ?",
    r: "Non. Tout le monde enquête, personne ne connaît la solution à l'avance. Le guide suffit pour lancer la partie.",
  },
  {
    q: "Comment on découvre la solution ?",
    r: "Un code est caché dans le dossier. Quand votre accusation est prête, vous le saisissez sur le site et la solution s'affiche. Pas de risque de la lire en imprimant.",
  },
  {
    q: "J'ai perdu mon fichier.",
    r: "Le lien de téléchargement reste valable. Il est dans l'e-mail de confirmation, depuis n'importe quel appareil.",
  },
];
