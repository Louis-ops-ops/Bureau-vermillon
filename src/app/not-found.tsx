import Image from "next/image";
import Link from "next/link";

export default function Introuvable() {
  return (
    <main id="contenu" className="introuvable">
      <Image className="introuvable__img" src="/img/mur-de-preuves.webp" alt="" fill preload sizes="100vw" />
      <div className="wrap introuvable__contenu">
        <span className="tampon-meta tampon-meta--fort">Erreur 404</span>
        <h1 className="titre">Cette page a disparu sans laisser de trace</h1>
        <p className="chapo">Elle n&apos;existe pas encore, ou plus. Le reste du dossier, lui, est bien là.</p>
        <Link className="btn-peinture" href="/">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
