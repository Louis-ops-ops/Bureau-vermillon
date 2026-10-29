// Gabarits communs des pièces HOT-00 : la page A4, le bandeau du Bureau, le pied, la page de garde.
// Reprise de travail/build.py (mêmes unités mm/pt, mêmes polices) : 210 mm = 794 px à l'écran.
import type { ReactNode } from "react";

export function Page({ piece, children, className = "" }: { piece?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`doc ${className}`}>
      {children}
      {piece && (
        <div className="doc__pied" aria-hidden="true">
          <span>Bureau Vermillon · Dossier HOT-00</span>
          <span>{piece}</span>
        </div>
      )}
    </div>
  );
}

export function Bandeau({ gauche, droite }: { gauche: string; droite: string }) {
  return (
    <div className="doc__bandeau">
      <div className="doc__bv">
        BUREAU <b>VERMILLON</b>
      </div>
      <div className="doc__meta doc__bandeau-meta">
        {gauche}
        <br />
        {droite}
      </div>
    </div>
  );
}

export function Garde({ lettre, titre, consigne, sous }: { lettre: string; titre: string; consigne: ReactNode; sous?: string }) {
  return (
    <Page className="doc--garde">
      <div className="doc__cadre">
        <div className="doc__meta">Bureau Vermillon · Dossier HOT-00 · Le palace d&apos;azur</div>
        <div className="doc__lettre" aria-hidden="true">
          {lettre}
        </div>
        <div className="doc__anton doc__garde-titre">{titre}</div>
        <p className="doc__garde-consigne">{consigne}</p>
        {sous && <p className="doc__small doc__gris doc__garde-sous">{sous}</p>}
      </div>
    </Page>
  );
}

/* Les signatures sont des indices : A et C doivent se distinguer au premier coup d'œil (build.py). */

/** Signature A, registre des voyageurs, ch. 7 : ronde, penchée à droite, sans paraphe */
export const SignatureA = () => <span className="doc__sig doc__sig--a">A. Delaroche</span>;

/** Signature B, registre des voyageurs, ch. 12 : fine et droite */
export const SignatureB = () => <span className="doc__sig doc__sig--b">O. Ferrand</span>;

/** Signature C, lettre de réservation : calligraphie ancienne, grand paraphe */
export function SignatureC() {
  return (
    <span className="doc__sig-c">
      <span className="doc__sig doc__sig--c">Ant. Delaroche</span>
      <svg className="doc__paraphe" width="78mm" height="14mm" viewBox="0 0 300 50" aria-hidden="true">
        <path
          d="M5 30 C 60 48, 140 46, 210 30 S 290 6, 260 22 C 240 34, 120 40, 40 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
