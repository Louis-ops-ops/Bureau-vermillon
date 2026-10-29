"use client";

import { useId, useState } from "react";
import { subscribeEmail } from "@/lib/demo/email";
import { track } from "@/lib/demo/track";

/**
 * Bloc e-mail de fin de parcours. PLACEHOLDER : subscribeEmail ne fait rien, aucune requête réseau.
 * Facultatif et jamais bloquant ; toujours posé SOUS le bouton principal.
 */
export function CaptureEmail() {
  const id = useId();
  const [note, setNote] = useState(false);

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    await subscribeEmail(email);
    track("email_placeholder_soumis");
    setNote(true);
  };

  return (
    <section className="capture" aria-labelledby={`${id}-titre`}>
      <h2 id={`${id}-titre`} className="capture__titre">
        Soyez prévenu à la sortie des premières enquêtes.
      </h2>
      {note ? (
        <p className="capture__note" role="status">
          C&apos;est noté.
        </p>
      ) : (
        <form className="capture__form" onSubmit={envoyer}>
          <div className="champ">
            <label htmlFor={`${id}-email`}>Votre adresse e-mail</label>
            <input id={`${id}-email`} type="email" name="email" autoComplete="email" inputMode="email" placeholder="prenom@domaine.fr" required />
          </div>
          <div className="case-a-cocher">
            <input id={`${id}-accord`} type="checkbox" name="accord" required />
            <label htmlFor={`${id}-accord`}>
              J&apos;accepte de recevoir les e-mails du Bureau Vermillon. Désinscription en un clic.{" "}
              <a className="lien-stylo" href="/confidentialite">
                Confidentialité
              </a>
            </label>
          </div>
          <div>
            <button type="submit" className="btn-tampon">
              Me prévenir
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
