// Acte 2, enveloppe A : P05 à P07. Chargé en import dynamique, seulement une fois l'enveloppe ouverte.
// Texte mot pour mot de pieces.md, mise en page de build.py.
import Image from "next/image";
import { PORTRAITS } from "@/content/demo/hot-00/dossier";
import { Bandeau, Page, SignatureC } from "./Doc";

function Fiche({
  n,
  portrait,
  champs,
  declaration,
}: {
  n: number;
  portrait: { src: string; alt: string };
  champs: [string, string][];
  declaration: string;
}) {
  return (
    <div className="doc__fiche">
      {/* PortraitSuspect : cadre vermillon en CSS, l'image posée dedans, sans ombre */}
      <span className="suspect__cadre doc__portrait">
        {/* servi en pleine définition : l'alliance doit se voir une fois zoomé */}
        <span className="doc__portrait-img">
          <Image src={portrait.src} alt={portrait.alt} fill sizes="819px" />
        </span>
      </span>
      <div className="doc__fiche-texte">
        <div className="doc__meta doc__rouge">Fiche {n}</div>
        <table className="doc__champs">
          <tbody>
            {champs.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="doc__declaration">
          <b className="doc__meta">Déclaration :</b>
          <br />
          {declaration}
        </p>
      </div>
    </div>
  );
}

export function P05() {
  return (
    <Page piece="P05">
      <Bandeau gauche="Dossier HOT-00" droite="Personnes retenues" />
      <Fiche
        n={1}
        portrait={PORTRAITS.delaroche}
        champs={[
          ["Nom déclaré", "Antoine DELAROCHE"],
          ["Chambre", "7"],
          ["Arrivée", "13 août 1956"],
          ["Profession déclarée", "négociant en vins"],
          ["Domicile déclaré", "Saint-Émilion (Gironde)"],
          ["Dépôt au coffre", "n° 62, mallette de cuir"],
        ]}
        declaration="« Je me suis couché tôt, je n'ai rien entendu. On m'a volé le pli que ma banque m'avait fait parvenir, et l'on me refuse ma propre mallette ! Je suis attendu à Paris : je ne vois pas pourquoi l'on me retient. »"
      />
      <Fiche
        n={2}
        portrait={PORTRAITS.ferrand}
        champs={[
          ["Nom déclaré", "Odette FERRAND"],
          ["Chambre", "12"],
          ["Arrivée", "13 août 1956"],
          ["Profession déclarée", "sans profession"],
          ["Domicile déclaré", "Lyon (Rhône)"],
          ["Dépôt au coffre", "n° 63, écrin (une bague, un bracelet)"],
        ]}
        declaration="« Je n'ai pas quitté ma chambre de la nuit. Mes bagages et mon courrier ne regardent que moi. On m'a volé mes bijoux : c'est moi la victime, ici. »"
      />
    </Page>
  );
}

export function P06() {
  return (
    <Page piece="P06">
      <div className="doc__entete-lettre">
        <div className="doc__domaine">Domaine Delaroche</div>
        <div className="doc__meta">Négoce de vins fins — Saint-Émilion (Gironde)</div>
      </div>
      <div className="doc__lettre-corps">
        <div className="doc__manu doc__annotation-hotel">
          Rép. le 5/7.
          <br />
          Ch. 7 réservée du 14 au 21/8.
          <br />— H. C.
        </div>
        <p className="doc__date-lettre">Saint-Émilion, le 2 juillet 1956</p>
        <p>
          Monsieur le Directeur
          <br />
          Grand Hôtel Azuréa
          <br />
          Boulevard de la Croisette, Cannes
        </p>
        <p className="doc__mt4">Monsieur le Directeur,</p>
        <p>
          Je vous prie de bien vouloir me réserver une chambre du <b>14 au 21 août prochain</b>. J&apos;arriverai le 14 à midi, par le train de
          Bordeaux. Je souhaiterais une chambre au calme : à soixante-huit ans, le bruit de la Croisette ne me vaut plus rien.
        </p>
        <p>
          Ma banque, la maison Lacoste &amp; Fils, vous fera parvenir d&apos;ici là un pli cacheté, destiné à l&apos;achat d&apos;un domaine sur la
          Côte. Je vous prie de le garder au coffre et de ne le remettre qu&apos;à moi, en main propre, sur présentation de mes papiers. Ma famille
          sait que ce pli vous est adressé : ne le remettez à personne d&apos;autre, quel que soit le nom qu&apos;on vous présente, fût-ce le mien.
        </p>
        <p>Veuillez agréer, Monsieur le Directeur, l&apos;assurance de ma considération distinguée.</p>
        <div className="doc__signature-lettre">
          <SignatureC />
        </div>
      </div>
    </Page>
  );
}

export function P07() {
  return (
    <Page piece="P07">
      <div className="doc__tampon-haut">
        <span className="doc__tampon doc__tampon--remise">
          Pièce remise spontanément par l&apos;intéressée lors de son audition — 14 août 1956 — Bureau Vermillon
        </span>
      </div>
      <div className="doc__entete-lettre">
        <div className="doc__anton doc__cabinet">CABINET LEFORT &amp; ASSOCIÉS</div>
        <div className="doc__meta">Avocats à la Cour — Lyon</div>
      </div>
      <div className="doc__lettre-corps">
        <p className="doc__droite">Lyon, le 9 août 1956</p>
        <p>
          Madame Odette MARCHAL, née FERRAND
          <br />
          Lyon
        </p>
        <p className="doc__mt6">Madame,</p>
        <p>
          Comme convenu lors de notre dernier entretien, la requête en séparation de corps sera déposée dès la rentrée. D&apos;ici là, nous vous
          recommandons la plus grande discrétion : votre époux ne doit pas connaître le lieu de votre séjour.
        </p>
        <p>
          Pendant la durée de votre absence, vous voyagerez et descendrez à l&apos;hôtel sous votre nom de jeune fille, Ferrand, comme vous en avez le
          droit. Évitez de faire suivre votre courrier.
        </p>
        <p>Écrivez-nous dès votre arrivée, afin que nous sachions où vous joindre en cas de nécessité.</p>
        <p>Veuillez agréer, Madame, l&apos;expression de nos sentiments dévoués.</p>
        <p className="doc__mt6 doc__pour-cabinet">Pour le cabinet,</p>
        <div className="doc__signature-lettre">
          <svg width="40mm" height="16mm" viewBox="0 0 160 60" aria-hidden="true" className="doc__paraphe-avocat">
            <path
              d="M8 40 C 20 5, 35 5, 38 35 S 55 55, 62 20 C 70 0, 80 45, 95 30 S 130 10, 150 38"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </Page>
  );
}

const PIECES_ACTE2 = { P05, P06, P07 };

/** Point d'entrée de l'import dynamique (voir Visionneuse). */
export default function PieceActe2({ id }: { id: keyof typeof PIECES_ACTE2 }) {
  const Piece = PIECES_ACTE2[id];
  return <Piece />;
}
