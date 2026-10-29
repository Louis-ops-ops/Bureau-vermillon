"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { policesDossier } from "@/lib/demo/polices";
import { dispatch, reinitialiser, useDemo } from "@/lib/demo/store";
import { BarreHaut } from "./BarreHaut";
import { Bureau } from "./Bureau";
import { Enveloppe } from "./Enveloppe";
import { IntroBD } from "./IntroBD";
import { Regles } from "./Regles";

// La solution n'arrive qu'à l'ouverture de l'enveloppe C : ni dans le bundle principal, ni dans le DOM avant.
const Solution = dynamic(() => import("./Solution"), {
  loading: () => <p className="jeu__chargement">Ouverture de l&apos;enveloppe…</p>,
});

/**
 * Le tunnel de la démo : une seule route, pilotée par l'état. Recharger la page reprend à la même étape.
 * Les champs de la grille, l'historique du registre et les cases du barème sont sauvegardés à chaque saisie.
 */
export function Demo() {
  const etat = useDemo();

  // pas de partie (ou partie effacée) : on en ouvre une, le chrono part du premier écran d'intro
  useEffect(() => {
    if (etat === null) dispatch({ type: "demarrer", now: Date.now() });
  }, [etat]);

  const recommencer = () => {
    reinitialiser();
    dispatch({ type: "demarrer", now: Date.now() });
  };

  if (!etat) {
    return (
      <div className={`jeu ${policesDossier}`}>
        <p className="jeu__chargement">Ouverture du dossier…</p>
      </div>
    );
  }

  const bureau = etat.etape === "acte1" || etat.etape === "acte2";

  return (
    <div className={`jeu ${policesDossier}`} data-lenis-prevent>
      <BarreHaut etat={etat} onRecommencer={recommencer} />
      <main id="contenu" tabIndex={-1} className={`jeu__scene${bureau ? " jeu__scene--bureau" : ""}`}>
        {etat.etape === "intro" && <IntroBD />}
        {etat.etape === "regles" && <Regles />}
        {bureau && <Bureau etat={etat} />}
        {etat.etape === "enveloppeA" && <Enveloppe lettre="A" />}
        {etat.etape === "enveloppeC" && <Enveloppe lettre="C" />}
        {etat.etape === "solution" && <Solution etat={etat} />}
      </main>
    </div>
  );
}
