// Mesure de la démo : préparée, pas branchée. Les événements diront où les joueurs bloquent.

export type Evenement =
  | "demo_start"
  | "demo_mode_choisi"
  | "paragraphe_ouvert"
  | "tete_beche_retournee"
  | "acte1_valide"
  | "accusation_signee"
  | "verification_acte2"
  | "solution_vue"
  | "resultat_declare"
  | "email_placeholder_soumis";

export function track(nom: Evenement, props?: Record<string, string | number | boolean>) {
  // TODO: brancher Vercel Analytics ou Plausible
  if (process.env.NODE_ENV === "development") console.debug("[track]", nom, props ?? {});
}
