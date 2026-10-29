"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { duree, type Etape, type EtatDemo } from "@/lib/demo/etat";
import { useHorloge } from "@/lib/demo/store";
import { Confirmation, Modale } from "../Modale";
import { ContenuRegles } from "./Regles";

const LIBELLES: Record<Etape, string> = {
  intro: "Introduction",
  regles: "Introduction",
  acte1: "Acte 1 — Les faits",
  enveloppeA: "Acte 2 — L'accusation",
  acte2: "Acte 2 — L'accusation",
  enveloppeC: "Solution",
  solution: "Solution",
};

export function formatDuree(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Le chrono s'arrête à la vérification de l'acte 2. */
function Chrono({ etat }: { etat: EtatDemo }) {
  const maintenant = useHorloge();
  const ms = etat.finActe2 !== undefined ? duree(etat) : maintenant - etat.debut;
  return (
    <p className="barre__chrono" role="timer" aria-label="Temps écoulé">
      {formatDuree(ms)}
    </p>
  );
}

export function BarreHaut({ etat, onRecommencer }: { etat: EtatDemo; onRecommencer: () => void }) {
  const id = useId();
  const [menu, setMenu] = useState(false);
  const [regles, setRegles] = useState(false);
  const [confirmer, setConfirmer] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  // Échap ou clic ailleurs referme le menu
  useEffect(() => {
    if (!menu) return;
    const clavier = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const clic = (e: PointerEvent) => !zone.current?.contains(e.target as Node) && setMenu(false);
    document.addEventListener("keydown", clavier);
    document.addEventListener("pointerdown", clic);
    return () => {
      document.removeEventListener("keydown", clavier);
      document.removeEventListener("pointerdown", clic);
    };
  }, [menu]);

  return (
    <header className="barre">
      <p className="barre__dossier">
        <span className="barre__code">HOT-00</span>
        <span className="barre__sep" aria-hidden="true">
          ·
        </span>
        <span className="barre__nom">Le palace d&apos;azur</span>
      </p>
      <p className="barre__etape">{LIBELLES[etat.etape]}</p>
      <Chrono etat={etat} />
      <div ref={zone} className="barre__menu">
        <button type="button" className="barre__bouton" aria-expanded={menu} aria-controls={`${id}-menu`} onClick={() => setMenu((m) => !m)}>
          Menu
        </button>
        <ul id={`${id}-menu`} className="barre__liste" hidden={!menu}>
          <li>
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                setRegles(true);
              }}
            >
              Revoir les règles
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                setConfirmer(true);
              }}
            >
              Recommencer
            </button>
          </li>
          <li>
            <Link href="/gratuit">Quitter (partie sauvegardée)</Link>
          </li>
        </ul>
      </div>

      <Modale ouverte={regles} titre="Comment vérifier une réponse" onFermer={() => setRegles(false)} className="modale--large">
        <ContenuRegles />
        <div className="modale__actions">
          <button type="button" className="btn-tampon" onClick={() => setRegles(false)} autoFocus>
            Fermer
          </button>
        </div>
      </Modale>
      <Confirmation
        ouverte={confirmer}
        titre="Recommencer l'enquête ?"
        texte="Votre progression, votre grille et vos notes seront effacées. Le chrono repart de zéro."
        confirmer="Recommencer"
        onConfirmer={() => {
          setConfirmer(false);
          onRecommencer();
        }}
        onAnnuler={() => setConfirmer(false)}
      />
    </header>
  );
}
