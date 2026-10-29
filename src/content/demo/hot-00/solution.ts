// Enveloppe C, mot pour mot depuis sources/enveloppe-c-solution.md.
// Chargée en import dynamique, et seulement à l'ouverture de l'enveloppe C.
// Retirés pour l'écran : la ligne du QR code (propre au print) et la consigne d'édition de l'encadré.
import type { Accusation } from "@/lib/demo/etat";

export interface LigneBareme {
  cle: string;
  texte: string;
  points: number;
  /** le champ de l'accusation à montrer à côté, pour que le joueur se note honnêtement */
  champ: keyof Accusation;
}

export const BAREME = {
  lignes: [
    { cle: "coupable", texte: "Le coupable : l'homme de la chambre 7, qui se fait appeler Antoine Delaroche", points: 3, champ: "coupable" },
    { cle: "vraiment", texte: "Qui il est vraiment : un parent d'Antoine Delaroche, aux initiales J. D. (son neveu)", points: 2, champ: "vraiment" },
    { cle: "cherchait", texte: "Ce qu'il cherchait : le pli de banque de son oncle ; il a vidé tout le coffre pour le cacher", points: 2, champ: "cherchait" },
    { cle: "comment-cle", texte: "Comment : la clé prise dans le tiroir, pendant la ronde du veilleur", points: 1, champ: "comment" },
    { cle: "comment-butin", texte: "Comment : le butin caché dans sa propre mallette, restée au coffre", points: 1, champ: "comment" },
    { cle: "piece-p06", texte: "Pièce citée : la lettre de réservation (P06) contre le registre des voyageurs (P01) ou le portrait (P05)", points: 1, champ: "pieces" },
    { cle: "piece-jd", texte: "Pièce citée : le chiffre « J. D. » du registre des dépôts (P02)", points: 1, champ: "pieces" },
    { cle: "piece-p04", texte: "Pièce citée : l'audition du veilleur (P04), pour écarter Mme Ferrand", points: 1, champ: "pieces" },
  ] satisfies LigneBareme[],
  retrait: "Retirez 1 point par indice imprimé tête-bêche que vous avez lu.",
};

export const RECIT = [
  "Antoine Delaroche, négociant en vins à Saint-Émilion, n'a jamais eu d'enfant. Son neveu Julien a grandi en se croyant son héritier. Un soir de juillet 1956, au dîner de famille, l'oncle annonce qu'il achète un domaine sur la Côte. Sa banque fera déposer au Grand Hôtel Azuréa un pli de bons au porteur, qu'il viendra chercher le 14 août. Julien entend tout. Cet argent, il le considère comme le sien.",
  "Le 13 août, à 18 h 30, Julien se présente à l'Azuréa sous le nom de son oncle. Personne, à l'hôtel, n'a jamais vu Antoine Delaroche. Il a « pu avancer son voyage d'un jour » ; la chambre 7 est libre, on la lui donne. Il signe le registre d'une main pressée et réclame aussitôt son pli. Mais le pli est à remettre en main propre, sur papiers, et Julien n'a que les siens, qui disent Julien. Il prétend qu'on les lui a volés dans le train. La réceptionniste refuse.",
  "Alors il change de plan. Il dépose au coffre sa propre mallette, chiffrée à ses initiales, et s'attarde au comptoir à demander les trains pour Paris. Il voit la réceptionniste ranger la clé dans le tiroir, pour la nuit.",
  "Pendant la ronde du veilleur, le comptoir reste vide une demi-heure. Julien descend, ouvre le coffre et prend tout : le pli, les bijoux, l'enveloppe du 21, la recette. Un voleur qui ne prend qu'un pli de banque désigne son destinataire ; un voleur qui vide le coffre n'est qu'un voleur. Il range le tout dans sa mallette, la referme à clé, remet la clé dans le tiroir et remonte. La porte de l'hôtel est fermée, mais il n'a pas besoin de sortir : le butin dort dans le seul endroit qu'on ne fouillera jamais, le coffre lui-même.",
  "Au matin, il n'avait qu'à réclamer sa mallette, jouer la victime du pli volé et partir avant midi, avant que son oncle ne descende du train de Bordeaux. M. Castellane a refusé de rendre quoi que ce soit. Il a bien fait.",
  "Julien avait oublié une chose : son oncle se méfiait de sa famille, et il l'avait écrit.",
];

export interface EtapeReconstitution {
  etape: string;
  pieces: string;
  tire: string;
  /** la ligne en gras dans la source */
  fort?: boolean;
}

export const RECONSTITUTION: EtapeReconstitution[] = [
  {
    etape: "Qui savait où dort la clé",
    pieces: "P03 + P02 + P01",
    tire: "La clé est rangée après le dernier dépôt, devant les clients des dépôts n° 62 (ch. 7) et n° 63 (ch. 12). M. Vidal avait repris sa montre avant.",
  },
  { etape: "Quand le vol a eu lieu", pieces: "P04 + P03", tire: "Le comptoir n'est vide que pendant la ronde du veilleur, porte fermée." },
  { etape: "Mme Ferrand tombe", pieces: "P04 + P07", tire: "Pendant la ronde, elle est à la porte du 12 ; son « faux nom » est son nom de jeune fille." },
  { etape: "L'erreur du coupable", pieces: "P01 + P06", tire: "La signature du registre n'est pas celle de la lettre de réservation.", fort: true },
  {
    etape: "L'âge et la date",
    pieces: "P05, P01, P03 + P06",
    tire: "Le vrai Delaroche a 68 ans et arrive le 14 à midi ; l'homme du 7 a la trentaine et s'est présenté le 13.",
  },
  {
    etape: "Qui il est vraiment",
    pieces: "P02 + P06",
    tire: "Sa mallette porte « J. D. », et l'oncle prévient : « ma famille sait que ce pli vous est adressé ». Un Delaroche, mais pas Antoine.",
  },
  { etape: "Ce qu'il cherchait", pieces: "P03 + P02 + P06", tire: "Il a réclamé le pli dès son arrivée ; refusé, il a tout pris pour le noyer dans le reste." },
  { etape: "Le butin", pieces: "P02 + P03", tire: "La mallette n° 62 est le seul dépôt intact, et son propriétaire la réclame en urgence." },
];

/** `ecarte` = la phrase en gras qui clôt la fiche */
export const INNOCENTS: { nom: string; texte: string; ecarte?: string }[] = [
  {
    nom: "Odette Ferrand",
    texte:
      "est en instance de séparation. Son avocat lui a conseillé de voyager sous son nom de jeune fille ; ses valises portent encore son nom d'épouse, Marchal. Vers minuit, elle est descendue poster une lettre à son avocat, et elle a menti pour que son mari ne retrouve pas sa trace.",
    ecarte: "Écartée par l'audition du veilleur (P04) : pendant la ronde, elle était à la porte de sa chambre.",
  },
  {
    nom: "Raymond Vidal",
    texte:
      "a repris sa montre à 18 h 20 et devait partir au premier train. Son départ était inscrit au registre dès son arrivée, et la clé était encore dans la poche de la réceptionniste quand il est passé au comptoir.",
    ecarte: "Écarté par P03 et P01.",
  },
  { nom: "Marcel Bonnet", texte: "laissait la clé du coffre dans le tiroir, contre le règlement. Une négligence, pas un vol." },
];

export const FAUSSES_PISTES: { titre: string; texte: string }[] = [
  {
    titre: "La dame aux deux noms.",
    texte:
      "Un nom au registre, un autre sur ses valises, une sortie de nuit, un mensonge : Mme Ferrand avait tout de l'imposteur. Il y avait bien deux noms d'emprunt dans cet hôtel. Le sien était un nom de jeune fille. L'autre était celui d'un oncle.",
  },
  {
    titre: "Le client pressé.",
    texte: "Un dépôt repris juste avant le vol, un départ à l'aube : M. Vidal avait l'air de savoir. Il voulait seulement rentrer à Marseille.",
  },
];

export const EPILOGUE = [
  "À midi, un homme de soixante-huit ans, canne à la main, est descendu du train de Bordeaux et s'est présenté à la réception du Grand Hôtel Azuréa sous le nom d'Antoine Delaroche. Dans le salon de la Direction, il a trouvé son neveu, assis entre deux agents.",
  "La mallette n° 62 a été ouverte devant lui. Le pli de la maison Lacoste & Fils était dessus, cachet intact. Il n'y manquait pas un franc.",
  "Antoine Delaroche n'a pas porté plainte. Il a seulement fait savoir, ce soir-là, qu'il avait pris rendez-vous avec son notaire. Pas pour le domaine.",
  "Mme Ferrand a récupéré son écrin et demandé que son nom ne figure pas dans le rapport. Il n'y figure pas. M. Vidal a pris le train de 14 heures. Marcel Bonnet porte désormais la clé du coffre sur lui, même pendant sa ronde.",
];

export const ENCADRE = "Cette affaire était la plus courte du Bureau. Les suivantes durent une soirée entière.";
