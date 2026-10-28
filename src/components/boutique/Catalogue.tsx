"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { CarteProduit } from "@/components/boutique/CarteProduit";
import { ENQUETES, NIVEAUX, type Niveau } from "@/content/catalogue";
import { UNIVERS, type UniversId } from "@/content/landing";
import { Flip, gsap, MQ, reveleTitre, useGSAP } from "@/lib/gsap";

type FiltreUnivers = UniversId | "tous";
type FiltreNiveau = Niveau | "tous";

const OPTIONS_UNIVERS: { id: FiltreUnivers; label: string }[] = [
  { id: "tous", label: "Tous" },
  ...UNIVERS.map((u) => ({ id: u.id, label: u.nom })),
];
const OPTIONS_NIVEAU: { id: FiltreNiveau; label: string }[] = [
  { id: "tous", label: "Tous niveaux" },
  ...([1, 2, 3] as Niveau[]).map((n) => ({ id: n, label: `${n}/3 ${NIVEAUX[n]}` })),
];

const estUnivers = (v: string | null): v is UniversId => UNIVERS.some((u) => u.id === v);
const estNiveau = (v: number): v is Niveau => v === 1 || v === 2 || v === 3;

/** Onglets d'univers (bureau), avec le repère vermillon qui glisse de l'un à l'autre (Flip). */
function Onglets({ valeur, choisir }: { valeur: FiltreUnivers; choisir: (v: FiltreUnivers) => void }) {
  return (
    <div className="filtres-boutique__onglets" role="group" aria-label="Univers">
      {OPTIONS_UNIVERS.map((o) => (
        <button key={o.id} type="button" className="onglet" aria-pressed={valeur === o.id} onClick={() => choisir(o.id)}>
          {o.label}
          {valeur === o.id && <span className="filtres__curseur" data-flip-id="repere-univers" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

/** Liste déroulante native : compacte, et le sélecteur du téléphone fait le reste. */
function Choix<T extends string | number>({
  id,
  libelle,
  options,
  valeur,
  choisir,
  className = "",
}: {
  id: string;
  libelle: string;
  options: { id: T; label: string }[];
  valeur: T;
  choisir: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`choix ${className}`}>
      <label className="choix__libelle" htmlFor={id}>
        {libelle}
      </label>
      <select id={id} className="choix__select" value={String(valeur)} onChange={(e) => choisir(e.target.value)}>
        {options.map((o) => (
          <option key={o.id} value={String(o.id)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Catalogue() {
  const ref = useRef<HTMLDivElement>(null);
  const [univers, setUnivers] = useState<FiltreUnivers>("tous");
  const [niveau, setNiveau] = useState<FiltreNiveau>("tous");
  const etat = useRef<Flip.FlipState | null>(null);

  // Le filtre arrive par l'URL (/enquetes?univers=viking depuis la landing).
  // Lu avant le premier affichage : le HTML serveur garde tout le catalogue (référencement),
  // le navigateur applique le filtre sans clignoter.
  useLayoutEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const u = p.get("univers");
    const n = Number(p.get("niveau"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation unique avec l'URL au montage
    if (estUnivers(u)) setUnivers(u);
    if (estNiveau(n)) setNiveau(n);
  }, []);

  const appliquer = (u: FiltreUnivers, n: FiltreNiveau) => {
    // Barre collée en haut d'écran : on remonte au début du catalogue avant de filtrer,
    // sinon le résultat, plus court, peut finir au-dessus de l'écran.
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
    const debut = ref.current!.getBoundingClientRect().top + window.scrollY - navH;
    if (window.scrollY > debut) window.scrollTo(0, debut);
    etat.current = Flip.getState(ref.current!.querySelectorAll(".rayon, .produit, .rayon__bientot, .filtres__curseur"));
    setUnivers(u);
    setNiveau(n);
    const p = new URLSearchParams();
    if (u !== "tous") p.set("univers", u);
    if (n !== "tous") p.set("niveau", String(n));
    const q = p.toString();
    window.history.replaceState(null, "", q ? `?${q}` : window.location.pathname);
  };

  const rayons = UNIVERS.filter((u) => univers === "tous" || univers === u.id)
    .map((u) => {
      const toutes = ENQUETES.filter((e) => e.univers === u.id);
      const visibles = toutes.filter((e) => niveau === "tous" || e.niveau === niveau);
      // un univers sans enquête publiée s'affiche « en préparation », sauf si on filtre par niveau
      const enPreparation = toutes.length === 0 && niveau === "tous";
      return { u, visibles, enPreparation };
    })
    .filter((r) => r.visibles.length > 0 || r.enPreparation);

  const total = rayons.reduce((n, r) => n + r.visibles.length, 0);

  useGSAP(
    () => {
      reveleTitre(document.querySelector(".boutique__titre")!);
      const mm = gsap.matchMedia();
      // Apparition sans déplacement de mise en page (veille Palace) : opacité et léger glissé,
      // une fois, quand la carte entre dans l'écran.
      mm.add(MQ.anime, () => {
        // l'intérieur, pas la barre : son transform sert à la cacher avec la nav
        gsap.from(".filtres-boutique__in", { y: 16, autoAlpha: 0, duration: 0.6, delay: 0.25 });
        gsap.utils.toArray<HTMLElement>(".produit, .rayon__bientot").forEach((el) => {
          gsap.from(el, { y: 32, autoAlpha: 0, duration: 0.7, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".rayon__trait").forEach((el) => {
          gsap.from(el, { scaleX: 0, transformOrigin: "left", duration: 0.6, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
      });
    },
    { scope: ref },
  );

  // Changement de filtre : les rayons et les cartes glissent vers leur nouvelle place.
  useGSAP(
    () => {
      if (!etat.current) return;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        Flip.from(etat.current, {
          duration: 0.6,
          ease: "encre",
          absolute: false,
          onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.1 }),
        });
      }
      etat.current = null;
    },
    { dependencies: [univers, niveau], scope: ref },
  );

  return (
    <div ref={ref}>
      {/* Une seule ligne, collée sous la nav et cachée avec elle quand on descend.
          Bureau : onglets d'univers + liste de difficulté. Mobile : deux listes côte à côte. */}
      <div className="filtres-boutique">
        <div className="wrap filtres-boutique__in">
          <Onglets valeur={univers} choisir={(u) => appliquer(u, niveau)} />
          <Choix
            id="filtre-univers"
            className="choix--univers"
            libelle="Univers"
            options={OPTIONS_UNIVERS}
            valeur={univers}
            choisir={(v) => appliquer(v as FiltreUnivers, niveau)}
          />
          <Choix
            id="filtre-niveau"
            className="choix--niveau"
            libelle="Difficulté"
            options={OPTIONS_NIVEAU}
            valeur={niveau}
            choisir={(v) => appliquer(univers, v === "tous" ? "tous" : (Number(v) as Niveau))}
          />
          <p className="filtres-boutique__total" role="status">
            {total} enquête{total > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {rayons.length === 0 ? (
        <div className="wrap boutique__vide">
          <p className="boutique__vide-titre">Aucune enquête à ce niveau pour l&apos;instant.</p>
          <p>D&apos;autres dossiers sont en cours d&apos;écriture. En attendant, élargis la recherche.</p>
          <button type="button" className="btn-tampon" onClick={() => appliquer("tous", "tous")}>
            Voir toutes les enquêtes
          </button>
        </div>
      ) : (
        rayons.map(({ u, visibles, enPreparation }, i) => (
          <section key={u.id} className="rayon" data-flip-id={`rayon-${u.id}`} data-univers={u.id} aria-labelledby={`rayon-${u.id}`}>
            <div className="wrap rayon__grille">
              <div className="rayon__tete">
                <span className="rayon__trait" aria-hidden="true" />
                <h2 id={`rayon-${u.id}`} className="rayon__titre">
                  {u.nom}
                </h2>
                <p className="rayon__compte">
                  {enPreparation ? "En préparation" : `${visibles.length} enquête${visibles.length > 1 ? "s" : ""}`}
                </p>
              </div>

              <div className={`rayon__produits${visibles.length > 1 ? " rayon__produits--plusieurs" : ""}`}>
                {enPreparation ? (
                  <div className="rayon__bientot" data-flip-id={`bientot-${u.id}`}>
                    <div className="rayon__bientot-media">
                      <Image src={`/img/key-art/key-art-${u.id}.webp`} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" />
                    </div>
                    <div className="rayon__bientot-texte">
                      <span className="tampon-meta tampon-meta--laiton">En préparation</span>
                      <p>La première enquête de cet univers est en cours d&apos;écriture.</p>
                      <Link className="lien-stylo" href="/#gratuit">
                        Être prévenu de la sortie
                      </Link>
                    </div>
                  </div>
                ) : (
                  visibles.map((e) => <CarteProduit key={e.slug} enquete={e} prioritaire={i === 0} />)
                )}
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  );
}
