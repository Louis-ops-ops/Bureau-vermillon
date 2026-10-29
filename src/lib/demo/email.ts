// Capture d'e-mail de fin de démo : PLACEHOLDER. Rien n'est envoyé, aucune requête réseau.
// Le formulaire ne doit pas être mis en ligne publiquement tant que l'envoi n'est pas branché.

/** `NEXT_PUBLIC_EMAIL_CAPTURE=true` une fois l'outil e-mail branché ; par défaut, mode placeholder. */
export const CAPTURE_EMAIL_ACTIVE = process.env.NEXT_PUBLIC_EMAIL_CAPTURE === "true";

export async function subscribeEmail(email: string): Promise<void> {
  // TODO: brancher l'outil e-mail (Brevo envisagé) avant la mise en ligne publique
  if (!CAPTURE_EMAIL_ACTIVE) return;
  void email;
}
