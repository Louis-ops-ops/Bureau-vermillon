"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ZIP } from "@/content/demo/hot-00/dossier";
import { reinitialiser, useDemo } from "@/lib/demo/store";
import { track } from "@/lib/demo/track";
import { Confirmation } from "./Modale";

/** Le choix de /gratuit : jouer en ligne (ou reprendre la partie en cours) ou télécharger les PDF. */
export function ChoixDemo() {
  const etat = useDemo();
  const router = useRouter();
  const id = useId();
  const [pdfOuvert, setPdfOuvert] = useState(false);
  const [confirmer, setConfirmer] = useState(false);
  const enCours = !!etat;

  const recommencer = () => {
    reinitialiser();
    setConfirmer(false);
    router.push("/gratuit/jouer");
  };

  return (
    <div className="choix-demo">
      <div className="choix-demo__principal">
        <Link
          className="btn-peinture btn-peinture--large btn-peinture--univers"
          href="/gratuit/jouer"
          onClick={() => track("demo_mode_choisi", { mode: "en_ligne" })}
        >
          {enCours ? "Reprendre l'enquête" : "Jouer en ligne"}
        </Link>
        {enCours && (
          <button type="button" className="lien-stylo choix-demo__recommencer" onClick={() => setConfirmer(true)}>
            Recommencer depuis le début
          </button>
        )}
      </div>

      <div className="choix-demo__pdf">
        <button
          type="button"
          className="btn-tampon"
          aria-expanded={pdfOuvert}
          aria-controls={`${id}-pdf`}
          onClick={() => setPdfOuvert((o) => !o)}
        >
          Télécharger les PDF
          <span className="choix-demo__chevron" aria-hidden="true" />
        </button>
        <div id={`${id}-pdf`} className="choix-demo__liens" hidden={!pdfOuvert}>
          <ul>
            {(["standard", "eco"] as const).map((v) => (
              <li key={v}>
                <a className="lien-stylo" href={ZIP[v].href} download onClick={() => track("demo_mode_choisi", { mode: "pdf", version: v })}>
                  {ZIP[v].libelle}
                </a>
              </li>
            ))}
          </ul>
          <p className="choix-demo__note">{ZIP.note}</p>
        </div>
      </div>

      <Confirmation
        ouverte={confirmer}
        titre="Recommencer l'enquête ?"
        texte="Votre progression, votre grille et vos notes seront effacées. Le chrono repart de zéro."
        confirmer="Recommencer"
        onConfirmer={recommencer}
        onAnnuler={() => setConfirmer(false)}
      />
    </div>
  );
}
