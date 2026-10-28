"use client";

import Link from "next/link";
import { useRef } from "react";
import { MARQUE, UNIVERS } from "@/content/landing";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

export function Pied() {
  const ref = useRef<HTMLElement>(null);

  // La dernière ligne de la page reprend la promesse du hero : elle monte quand on arrive au bout.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.anime, () => {
        gsap.from(".pied__accroche > span > span", {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: ".pied__accroche", start: "top 92%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="pied">
      <div className="wrap">
        <p className="pied__accroche" aria-hidden="true">
          <span>
            <span>Trouve le</span>
          </span>
          <span>
            <span>coupable.</span>
          </span>
        </p>

        <div className="pied__cols">
          <div className="pied__intro">
            <p className="pied__marque">{MARQUE}</p>
            <p>Des enquêtes à imprimer chez soi, de 1 à 6 joueurs. Personnages et lieux fictifs.</p>
          </div>
          <nav aria-label="Enquêtes" className="pied__col">
            <h2>Enquêtes</h2>
            <ul>
              {UNIVERS.map((u) => (
                <li key={u.id}>
                  <Link href={`/enquetes?univers=${u.id}`}>{u.nom}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Aide" className="pied__col">
            <h2>Aide</h2>
            <ul>
              <li>
                <a href="/comment-ca-marche">Comment ça marche</a>
              </li>
              <li>
                <Link href="/#faq">Questions fréquentes</Link>
              </li>
              <li>
                <Link href="/panier">Panier</Link>
              </li>
              <li>
                <a href="/solution">Entrer un code de solution</a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Informations légales" className="pied__col">
            <h2>Légal</h2>
            <ul>
              <li>
                <a href="/cgv">CGV</a>
              </li>
              <li>
                <a href="/mentions-legales">Mentions légales</a>
              </li>
              <li>
                <a href="/confidentialite">Confidentialité</a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="pied__bas">© 2026 {MARQUE}</p>
      </div>
    </footer>
  );
}
