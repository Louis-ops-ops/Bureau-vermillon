import { DISCLAIMER } from "@/content/demo/hot-00/dossier";

/** Obligatoire sur /gratuit et /resultat : la démo est la seule enquête qui se joue à l'écran. */
export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <aside className={`disclaimer ${className}`} aria-label="À savoir">
      <p className="disclaimer__etiquette">À savoir</p>
      <p>{DISCLAIMER}</p>
    </aside>
  );
}
