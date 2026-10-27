"use client";

import Image from "next/image";
import { useRef } from "react";
import { PAGES } from "@/content/landing";
import { gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

/* Position finale de chaque feuille sur la table (rotation max 2°, règle du système)
   et l'angle d'arrivée, plus franc, avant qu'elle ne se pose. */
const ARRIVEES = [
  { rotation: -1.4, depart: -9 },
  { rotation: 0.9, depart: 11 },
  { rotation: -0.6, depart: -7 },
  { rotation: 1.6, depart: 10 },
];

export function Recois() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reveleTitre(ref.current!.querySelector(".recois__titre")!);

      // Bureau : la scène est épinglée, chaque palier de scroll pose une pièce sur la table
      // et allume la ligne correspondante. Le lecteur découvre le contenu dans l'ordre où il
      // s'en servira le soir de la partie.
      mm.add(MQ.bureau, () => {
        const feuilles = gsap.utils.toArray<HTMLElement>(".feuille");
        const items = gsap.utils.toArray<HTMLElement>(".recois__item");
        // l'opacité va sur le libellé : sur le <li>, elle éteindrait aussi sa feuille
        const libelles = gsap.utils.toArray<HTMLElement>(".recois__libelle");

        gsap.set(feuilles, { yPercent: 160, xPercent: 30, rotation: (i) => ARRIVEES[i].depart, autoAlpha: 0 });
        gsap.set(items, { "--trait": 0 });
        gsap.set(libelles, { opacity: 0.62 });
        gsap.set(".recois__fond", { "--voile": 0.5 });

        const tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: {
            trigger: ".recois__scene",
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        feuilles.forEach((f, i) => {
          const t = i * 1.2;
          tl.to(f, { yPercent: 0, xPercent: 0, rotation: ARRIVEES[i].rotation, autoAlpha: 1, ease: "encre" }, t)
            .to(libelles[i], { opacity: 1, duration: 0.3, ease: "none" }, t + 0.2)
            .to(items[i], { "--trait": 1, duration: 0.5, ease: "none" }, t + 0.2);
          if (i > 0) tl.to(libelles[i - 1], { opacity: 0.62, duration: 0.3, ease: "none" }, t + 0.2);
        });
        tl.to(".recois__fond", { "--voile": 0.82, duration: feuilles.length * 1.2, ease: "none" }, 0);
        tl.to({}, { duration: 0.6 }); // respiration avant de décrocher
      });

      // Mobile : pas d'épinglage. Chaque pièce se pose quand sa ligne arrive à l'écran.
      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>(".feuille").forEach((f, i) => {
          gsap.from(f, {
            y: 80,
            rotation: ARRIVEES[i].depart / 2,
            autoAlpha: 0,
            duration: 0.7,
            scrollTrigger: { trigger: f, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="recois" aria-labelledby="recois-titre">
      <div className="recois__scene">
        <div className="recois__fond" aria-hidden="true">
          <Image
            src="/img/dossier-enquete.webp"
            alt=""
            fill
            sizes="100vw"
            className="recois__img"
          />
        </div>

        <div className="wrap recois__grille">
          <div className="recois__texte">
            <h2 id="recois-titre" className="titre recois__titre">
              Ce que tu reçois
            </h2>
            <p className="chapo">Un PDF, quatre éléments. Tout ce qu&apos;il faut pour jouer ce soir.</p>

            <ol className="recois__liste">
              <li className="recois__item">
                <div className="recois__libelle">
                  <h3>Le guide de l&apos;organisateur</h3>
                  <p>Quoi imprimer, dans quel ordre, ce qui va sous enveloppe.</p>
                </div>
                <div className="feuille feuille--guide" aria-hidden="true">
                  <p className="feuille__ref">Guide de l&apos;organisateur</p>
                  <p className="feuille__titre">Avant d&apos;ouvrir le dossier</p>
                  <ol className="feuille__etapes">
                    <li>Imprime les {PAGES} pages, recto seul.</li>
                    <li>Glisse la pièce n° 5 sous enveloppe.</li>
                    <li>Pose le dossier au centre de la table.</li>
                    <li>Donne une grille à chaque joueur.</li>
                  </ol>
                  <span className="feuille__lignes" />
                </div>
              </li>

              <li className="recois__item">
                <div className="recois__libelle">
                  <h3>Le dossier d&apos;enquête</h3>
                  <p>Dépositions, rapport d&apos;autopsie, plan des lieux, coupures de presse.</p>
                </div>
                <div className="feuille feuille--dossier" aria-hidden="true">
                  <p className="feuille__ref">Dossier n° 74-0314</p>
                  <p className="feuille__titre">Affaire du Balto</p>
                  <span className="feuille__photo">
                    <Image src="/img/suspects/policier-veuve.webp" alt="" width={240} height={300} sizes="120px" />
                  </span>
                  <span className="feuille__lignes" />
                  <span className="feuille__tampon">Confidentiel</span>
                </div>
              </li>

              <li className="recois__item">
                <div className="recois__libelle">
                  <h3>La grille de réponse</h3>
                  <p>Suspect, mobile, arme. Chacun note son accusation avant de comparer.</p>
                </div>
                <div className="feuille feuille--grille" aria-hidden="true">
                  <p className="feuille__ref">Grille de réponse</p>
                  <span className="feuille__table">
                    <span>Suspect</span>
                    <span>Mobile</span>
                    <span>Arme</span>
                  </span>
                  <span className="feuille__cases" />
                  <p className="feuille__accuse">Mon accusation :</p>
                </div>
              </li>

              <li className="recois__item">
                <div className="recois__libelle">
                  <h3>La solution, sous scellé</h3>
                  <p>Un code caché dans le dossier la débloque sur le site. Impossible de la lire par accident.</p>
                </div>
                <div className="feuille feuille--scelle" aria-hidden="true">
                  <span className="scelle__rabat" />
                  <span className="scelle__sceau" />
                  <span className="scelle__code">
                    <span>Code de solution</span>
                    <b>KRV-•••</b>
                  </span>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
