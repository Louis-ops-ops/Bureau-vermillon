"use client";

import { useRef, useState } from "react";
import { gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

type Etat = "repos" | "envoi" | "envoye" | "erreur-reseau";

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** TODO : brancher le vrai service d'envoi (Brevo, Resend…). En attendant, simulation locale. */
async function inscrire(email: string) {
  await new Promise((r) => setTimeout(r, 900));
  return email.length > 0;
}

export function Gratuit() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [etat, setEtat] = useState<Etat>("repos");

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reveleTitre(ref.current!.querySelector(".gratuit__titre")!);
      mm.add(MQ.anime, () => {
        gsap.from(".enveloppe", {
          y: 120,
          rotation: 6,
          autoAlpha: 0,
          duration: 0.85,
          scrollTrigger: { trigger: ".enveloppe", start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  // Retour d'action : le sceau se brise, le rabat s'ouvre, la mini-enquête sort.
  const ouvrir = contextSafe(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .to(".sceau__moitie--g", { xPercent: -40, yPercent: 30, rotation: -28, duration: 0.3 })
      .to(".sceau__moitie--d", { xPercent: 40, yPercent: 40, rotation: 24, duration: 0.3 }, "<")
      .to(".sceau__moitie", { autoAlpha: 0, duration: 0.2 }, "-=0.05")
      .to(".enveloppe__rabat", { scaleY: -1, duration: 0.35, ease: "power1.inOut" }, "-=0.15")
      .set(".enveloppe__rabat", { zIndex: 0 })
      .fromTo(".enveloppe__lettre", { yPercent: 0 }, { yPercent: -48, duration: 0.6, ease: "encre" }, "-=0.05");
  });

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_VALIDE.test(email.trim())) {
      setErreur("Cette adresse semble incomplète. Exemple : prenom@domaine.fr");
      return;
    }
    setErreur(null);
    setEtat("envoi");
    try {
      await inscrire(email.trim());
      setEtat("envoye");
      ouvrir();
    } catch {
      setEtat("erreur-reseau");
    }
  };

  return (
    <section ref={ref} id="gratuit" className="gratuit" aria-labelledby="gratuit-titre">
      <div className="wrap gratuit__grille">
        <div className="gratuit__texte">
          <h2 id="gratuit-titre" className="titre gratuit__titre">
            Une mini-enquête, offerte
          </h2>
          <p className="chapo">Une page à imprimer, trois suspects, un coupable. De quoi tester avant d&apos;acheter.</p>

          {etat === "envoye" ? (
            <div className="envoye" role="status">
              <p className="envoye__titre">Dossier envoyé</p>
              <p>Regarde ta boîte de réception. S&apos;il n&apos;y est pas dans cinq minutes, jette un œil aux indésirables.</p>
            </div>
          ) : (
            <form className="form" noValidate onSubmit={envoyer}>
              <div className="champ">
                <label htmlFor="gratuit-email">Ton adresse e-mail</label>
                <input
                  id="gratuit-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="prenom@domaine.fr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (erreur) setErreur(null);
                  }}
                  aria-invalid={erreur ? true : undefined}
                  aria-describedby={`gratuit-aide${erreur ? " gratuit-erreur" : ""}`}
                  required
                />
                <p id="gratuit-aide" className="champ__aide">
                  On t&apos;envoie l&apos;enquête, puis nos nouvelles sorties. Désinscription en un clic.
                </p>
                {erreur && (
                  <p id="gratuit-erreur" className="champ__erreur" role="alert">
                    {erreur}
                  </p>
                )}
              </div>

              {etat === "erreur-reseau" && (
                <p className="champ__erreur" role="alert">
                  L&apos;envoi n&apos;est pas passé. Vérifie ta connexion et réessaie.
                </p>
              )}

              <div className="form__bas">
                <button className="btn-peinture" type="submit" disabled={etat === "envoi"} aria-busy={etat === "envoi"}>
                  {etat === "envoi" ? "Envoi…" : "Recevoir l'enquête"}
                </button>
                <p className="form__legal">
                  Tes données restent chez nous.{" "}
                  <a className="lien-stylo" href="/confidentialite">
                    Confidentialité
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="enveloppe" aria-hidden="true">
          <div className="enveloppe__lettre">
            <p className="enveloppe__ref">Mini-enquête</p>
            <p className="enveloppe__nom">Le dernier verre</p>
            <span className="feuille__lignes" />
          </div>
          <span className="enveloppe__corps" />
          <span className="enveloppe__rabat" />
          <span className="sceau">
            <span className="sceau__moitie sceau__moitie--g" />
            <span className="sceau__moitie sceau__moitie--d" />
          </span>
          <span className="enveloppe__tampon">Offert</span>
        </div>
      </div>
    </section>
  );
}
