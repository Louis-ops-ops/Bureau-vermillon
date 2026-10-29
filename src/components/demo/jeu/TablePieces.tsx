"use client";

import Image from "next/image";
import { CASES, PIECES, PORTRAITS, type IdPiece, type MetaPiece } from "@/content/demo/hot-00/dossier";

const GROUPES: { acte: 1 | 2; titre: string }[] = [
  { acte: 1, titre: "Acte 1 — Dossier libre" },
  { acte: 2, titre: "Acte 2 — Enveloppe A" },
];

/** La table : les pièces disponibles en vignettes papier, groupées par acte. */
export function TablePieces({
  disponibles,
  ouvertes,
  active,
  onOuvrir,
}: {
  disponibles: MetaPiece[];
  ouvertes: string[];
  active?: IdPiece;
  onOuvrir: (id: IdPiece) => void;
}) {
  return (
    <div className="table-pieces">
      {GROUPES.filter((g) => disponibles.some((p) => p.acte === g.acte)).map((g) => (
        <section key={g.acte} className="table-pieces__groupe" aria-label={g.titre}>
          <h3 className="table-pieces__titre">{g.titre}</h3>
          <ul className="table-pieces__liste">
            {disponibles
              .filter((p) => p.acte === g.acte)
              .map((p) => {
                const nouvelle = !ouvertes.includes(p.id);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="vignette"
                      aria-current={active === p.id ? "true" : undefined}
                      aria-label={`${p.id}, ${p.titre}${nouvelle ? ", nouvelle pièce" : ""}`}
                      onClick={() => onOuvrir(p.id)}
                    >
                      <span className="vignette__ref">{p.id}</span>
                      <span className="vignette__titre">{p.titre}</span>
                      <Apercu id={p.id} />
                      {nouvelle && (
                        <span className="vignette__nouveau" aria-hidden="true">
                          Nouveau
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Un indice visuel de ce qu'il y a sur la feuille, sans rien en dire. */
function Apercu({ id }: { id: IdPiece }) {
  if (id === "P00") {
    return (
      <span className="vignette__apercu vignette__apercu--bd" aria-hidden="true">
        <Image src={CASES[0].src} alt="" width={1024} height={683} sizes="220px" />
      </span>
    );
  }
  if (id === "P05") {
    return (
      <span className="vignette__apercu vignette__apercu--portraits" aria-hidden="true">
        {[PORTRAITS.delaroche, PORTRAITS.ferrand].map((p) => (
          <Image key={p.vignette} src={p.vignette} alt="" width={480} height={600} sizes="40px" />
        ))}
      </span>
    );
  }
  return <span className="vignette__lignes" aria-hidden="true" />;
}

export const piecesDisponibles = (acte2: boolean) => PIECES.filter((p) => p.acte === 1 || acte2);
