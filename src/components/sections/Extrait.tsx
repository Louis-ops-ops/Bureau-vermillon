"use client";

import { Fragment, useRef } from "react";
import { gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

/**
 * Passage caviardé : le texte est dans le DOM (lecteur d'écran, Google), les barres sont un décor.
 * Une barre par mot : un passage qui se coupe en fin de ligne garde des barres bien posées.
 */
function Caviarde({ children }: { children: string }) {
  const mots = children.split(" ");
  return (
    <span className="caviarde">
      {mots.map((m, i) => (
        <Fragment key={i}>
          <span className="caviarde__mot">{m}</span>
          {i < mots.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}

export function Extrait() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reveleTitre(ref.current!.querySelector(".extrait__titre")!);

      mm.add(MQ.anime, () => {
        // La pièce se pose sur la table, puis la coupure de presse par-dessus.
        gsap
          .timeline({ scrollTrigger: { trigger: ".extrait__table", start: "top 78%", once: true } })
          .from(".extrait__piece", { y: 140, rotation: -6, autoAlpha: 0, duration: 0.85 })
          .from(".coupure", { y: 120, rotation: 5, autoAlpha: 0, duration: 0.75 }, 0.2);

        // Déclassification : les barres noires se retirent pendant la lecture,
        // une par une, au rythme du scroll. Ça oblige l'œil à suivre le texte.
        gsap.utils.toArray<HTMLElement>(".caviarde").forEach((c) => {
          gsap.fromTo(
            c.querySelectorAll(".caviarde__mot"),
            { "--barre": 1 },
            {
              "--barre": 0,
              ease: "none",
              stagger: 0.35,
              scrollTrigger: { trigger: c, start: "top 72%", end: "top 46%", scrub: 0.4 },
            },
          );
        });

        // Les questions de l'enquêteur apparaissent quand le passage qu'elles annotent est lu.
        gsap.utils.toArray<HTMLElement>(".note").forEach((n) => {
          gsap.from(n, { x: -16, autoAlpha: 0, duration: 0.5, scrollTrigger: { trigger: n, start: "top 70%", once: true } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="extrait" aria-labelledby="extrait-titre">
      <div className="wrap extrait__grille">
        <div className="extrait__texte">
          <h2 id="extrait-titre" className="titre extrait__titre">
            Lis une vraie pièce du dossier
          </h2>
          <p className="chapo">
            La déposition du patron du Balto, en entier, telle qu&apos;elle sera dans ton dossier. Elle ne donne pas
            la solution. Mais quelqu&apos;un, dedans, ne dit pas tout.
          </p>
          <a className="lien-stylo" href="/univers/policier">
            Voir l&apos;univers Policier
          </a>
        </div>

        <div className="extrait__table" data-univers="policier">
          <article className="piece piece--a extrait__piece" aria-label="Pièce numéro 4, déposition de Marcel Tonnelier">
            <p className="piece__entete">Pièce n° 04 · Déposition du 15 mars 1974</p>
            <p className="extrait__temoin">
              Témoin : Marcel Tonnelier, 52 ans, patron du café Le Balto, Paris 11e.
            </p>

            <div className="extrait__corps">
              <p>
                Je fermais la caisse vers vingt-deux heures. Raymond était encore au comptoir. Il avait gagné aux
                courses dans l&apos;après-midi et il <Caviarde>payait des tournées à tout le monde</Caviarde>, ce qui ne
                lui ressemblait pas.
              </p>
              <p>
                Sa femme est passée un peu avant dix heures. Elle n&apos;est pas entrée. Je l&apos;ai vue derrière la
                vitre avec <Caviarde>ses gants noirs</Caviarde>, elle a frappé deux fois au carreau.
              </p>
              <p>
                Raymond est sorti <Caviarde>par la cour, pas par la rue</Caviarde>. Je ne sais pas pourquoi. Au même
                moment, le voisin du premier a fermé ses volets. Je l&apos;ai entendu, ils grincent.
              </p>
              <p>
                Après, plus rien. Pas un cri. J&apos;ai éteint la salle et je suis monté me coucher. C&apos;est le
                lendemain matin, en sortant les poubelles, que je l&apos;ai trouvé.
              </p>
            </div>

            <div className="extrait__bas">
              <p className="extrait__signature">Lu et approuvé. M. Tonnelier</p>
              <span className="piece__tampon">Pièce à conviction</span>
            </div>
          </article>

          <aside className="extrait__notes" aria-label="Notes de l'enquêteur">
            <p className="note note--1">D&apos;où vient l&apos;argent des tournées ?</p>
            <p className="note note--2">Elle frappe, mais n&apos;entre pas.</p>
            <p className="note note--3">Qui sort par une cour, la nuit ?</p>
          </aside>

          <article className="piece piece--b coupure" aria-label="Coupure de presse">
            <p className="coupure__journal">La Gazette du Faubourg, 16 mars 1974</p>
            <p className="coupure__titre">Un habitué retrouvé mort derrière un café</p>
            <p>
              Raymond Ferrand, 47 ans, a été découvert hier matin dans la cour du Balto. La police n&apos;écarte
              aucune piste.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
