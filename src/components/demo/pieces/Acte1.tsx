// Acte 1, dossier libre : P00 à P04. Texte mot pour mot de pieces.md, mise en page de build.py.
// Les consignes *[entre crochets]* et les lignes « Type / Contrôle » ne sont jamais rendues.
import Image from "next/image";
import { CASES, type CaseBD } from "@/content/demo/hot-00/dossier";
import { Bandeau, Page, SignatureA, SignatureB } from "./Doc";

function Case({ c, hauteur, className = "" }: { c: CaseBD; hauteur: number; className?: string }) {
  return (
    <div className={`doc__case ${className}`} style={{ height: `${hauteur}mm` }}>
      {/* pleine définition : la visionneuse zoome jusqu'à 5 fois */}
      <Image src={c.src} alt={c.alt} fill sizes={`${c.largeur}px`} />
      {c.recits && (
        <div className="doc__recits">
          {c.recits.map((r) => (
            <span key={r} className="doc__recit">
              {r}
            </span>
          ))}
        </div>
      )}
      {c.bulle && <p className={`doc__bulle doc__bulle--${c.position}`}>{c.bulle}</p>}
    </div>
  );
}

export function P00() {
  const [c1, c2, c3, c4] = CASES;
  return (
    <Page piece="P00">
      <div className="doc__p00-tete">
        <h1 className="doc__titre">Le palace d&apos;azur</h1>
        <div className="doc__meta doc__droite">
          Pièce P00
          <br />À lire à voix haute
        </div>
      </div>
      <div className="doc__planche">
        <Case c={c1} hauteur={74} />
        <div className="doc__planche-ligne">
          <Case c={c2} hauteur={74} />
          <Case c={c3} hauteur={74} />
        </div>
        <Case c={c4} hauteur={74} />
      </div>
    </Page>
  );
}

const sig = (texte: string, famille: "reenie" | "homemade" = "reenie") => (
  <span className={`doc__sig doc__sig--${famille}`}>{texte}</span>
);

export function P01() {
  const lignes = [
    ["1 409", "11 août, 10 h 50", ["BERTIN", "Paul"], "Industriel", "Paris", "21", "18 août", sig("P. Bertin")],
    ["1 410", "13 août, 9 h 55", ["VIDAL", "Raymond"], "Représentant", "Marseille", "9", "14 août, 1er train", sig("R. Vidal", "homemade")],
    ["1 411", "13 août, 18 h 30", ["DELAROCHE", "Antoine"], "Négociant en vins", "Saint-Émilion (Gironde)", "7", "21 août", <SignatureA key="a" />],
    ["1 412", "13 août, 18 h 45", ["FERRAND", "Odette (Mme)"], "Sans profession", "Lyon (Rhône)", "12", "20 août", <SignatureB key="b" />],
  ] as const;
  return (
    <Page piece="P01">
      <div className="doc__entete-hotel">
        <div className="doc__anton doc__hotel">GRAND HÔTEL AZURÉA</div>
        <div className="doc__meta">Boulevard de la Croisette — Cannes (Alpes-Maritimes)</div>
        <div className="doc__anton doc__filet-titre">REGISTRE DES VOYAGEURS</div>
        <div className="doc__meta doc__mt2">Feuillet n° 214 — Arrivées du 11 au 13 août 1956</div>
      </div>
      <table className="doc__table doc__table--registre">
        <thead>
          <tr>
            {["N° d'ordre", "Arrivée", "Nom et prénoms", "Profession", "Domicile habituel", "Ch.", "Départ prévu", "Signature"].map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map(([no, arrivee, [nom, prenom], profession, domicile, ch, depart, signature]) => (
            <tr key={no} className="doc__ligne-voyageur">
              <td>{no}</td>
              <td>{arrivee}</td>
              <td>
                {nom}
                <br />
                {prenom}
              </td>
              <td>{profession}</td>
              <td>{domicile}</td>
              <td>{ch}</td>
              <td>{depart}</td>
              <td className="doc__milieu">{signature}</td>
            </tr>
          ))}
          {[0, 1].map((i) => (
            <tr key={i} className="doc__ligne-vide" aria-hidden="true">
              {Array.from({ length: 8 }, (_, j) => (
                <td key={j} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="doc__bas-droite">
        <span className="doc__tampon">Extrait certifié conforme — Bureau Vermillon — 14 août 1956</span>
      </div>
    </Page>
  );
}

export function P02() {
  const depots = [
    ["57", "11 août", "11 h 05", "21", "Enveloppe cachetée (espèces)", "200 000 F", "S. A.", ""],
    ["58", "12 août", "9 h 40", "3", "Collier de perles, en étui", "450 000 F", "S. A.", ""],
    ["59", "12 août", "15 h", "—", "pli", "Non communiquée", "S. A.", ""],
    ["60", "13 août", "10 h 15", "9", "Montre et boutons de manchette, or", "180 000 F", "S. A.", "13/8, 18 h 20 — S. A."],
    ["61", "13 août", "18 h 30", "—", "Recette du jour (caisse de la réception)", "640 000 F", "H. C.", ""],
    ["62", "13 août", "18 h 40", "7", "Mallette de cuir noir, chiffrée « J. D. », fermée à clé — « documents »", "Non déclarée", "S. A.", ""],
    ["63", "13 août", "18 h 50", "12", "Écrin : une bague, un bracelet", "300 000 F", "S. A.", ""],
  ];
  return (
    <Page piece="P02">
      <div className="doc__entete-hotel doc__entete-hotel--depots">
        <div className="doc__anton doc__hotel doc__hotel--m">GRAND HÔTEL AZURÉA — RÉCEPTION</div>
        <div className="doc__anton doc__sous-hotel">Registre des dépôts au coffre</div>
        <p className="doc__small doc__avertissement">
          Objets et valeurs confiés par MM. les voyageurs. Tout dépôt donne lieu à un reçu. La Direction ne répond que des dépôts inscrits.
        </p>
      </div>
      <table className="doc__table doc__table--depots">
        <thead>
          <tr>
            {["N°", "Date", "Heure", "Ch.", "Nature du dépôt", "Valeur déclarée", "Visa", "Retrait"].map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {depots.map(([no, date, heure, ch, nature, valeur, visa, retrait]) => (
            <tr key={no}>
              <td>{no}</td>
              <td>{date}</td>
              <td>{heure}</td>
              <td>{ch}</td>
              <td>
                {nature === "pli" ? (
                  <>
                    Pli cacheté de la Banque Lacoste &amp; Fils (Bordeaux), pour M. Antoine Delaroche — <b>à remettre en main propre, sur papiers</b>
                  </>
                ) : (
                  nature
                )}
              </td>
              <td>{valeur}</td>
              <td>
                <span className="doc__manu doc__manu--visa">{visa}</span>
              </td>
              <td>
                <span className="doc__manu doc__manu--retrait">{retrait}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="doc__manu doc__note-castellane">
        <p>14/8 — 7 h. Coffre ouvert en ma présence et celle de Mlle Arnaud. Dépôts 57, 58, 59, 61 et 63 disparus — le pli de M. Delaroche avec.</p>
        <p>Seul le n° 62 (ch. 7) est encore là : mallette fermée à clé, que je n&apos;ai pas fait ouvrir. Rien n&apos;est rendu à personne avant l&apos;arrivée du Bureau.</p>
        <p className="doc__droite">— H. Castellane</p>
      </div>
    </Page>
  );
}

function Audition({
  piece,
  heure,
  temoin,
  qr,
  signature,
}: {
  piece: string;
  heure: string;
  temoin: string;
  qr: [string, string][];
  signature: string;
}) {
  return (
    <Page piece={piece}>
      <Bandeau gauche="Dossier HOT-00" droite="Audition de témoin" />
      <p className="doc__meta doc__lieu">Grand Hôtel Azuréa, salon de la Direction — 14 août 1956, {heure}</p>
      <p className="doc__temoin">
        <b className="doc__anton">TÉMOIN :</b> {temoin}
      </p>
      {qr.map(([q, r]) => (
        <div key={q} className="doc__qr">
          <p>
            <b>Q. —</b> {q}
          </p>
          <p>
            <b>R. —</b> {r}
          </p>
        </div>
      ))}
      <div className="doc__signe">
        <span>Lu, persiste et signe.</span>
        <span className="doc__manu doc__manu--temoin">{signature}</span>
      </div>
    </Page>
  );
}

export function P03() {
  return (
    <Audition
      piece="P03"
      heure="9 h 10"
      temoin="Mlle Simone ARNAUD, réceptionniste de jour."
      signature="S. Arnaud"
      qr={[
        [
          "La clé du coffre, où est-elle dans la journée ?",
          "Dans ma poche, toujours. Je la sors pour chaque dépôt ou chaque retrait, et je la remets dans ma poche. Le soir, après le dernier dépôt, je la range dans le tiroir du comptoir pour le veilleur, et je pars à 19 heures.",
        ],
        [
          "Racontez la fin de votre service, hier.",
          "M. Vidal, du 9, est venu reprendre sa montre : il prend le premier train ce matin. Puis M. Castellane a déposé la recette. À 18 h 30, M. Delaroche est arrivé. Il était attendu le 14, mais il avait pu avancer son voyage d'un jour. La 7, qui lui était réservée, était libre : je la lui ai donnée. Il a signé le registre en deux secondes.",
        ],
        [
          "Il a demandé quelque chose ?",
          "Son pli, tout de suite. Sa banque l'avait fait déposer la veille. Mais le pli était à remettre en main propre, sur papiers, et il n'en avait pas : on les lui aurait volés dans le train. J'ai refusé. M. Castellane devait trancher le lendemain. Il n'a pas insisté. Il a déposé une mallette, puis il est resté au comptoir à me demander les trains pour Paris.",
        ],
        [
          "Ensuite ?",
          "Mme Ferrand est arrivée et m'a confié son écrin. C'était le dernier dépôt de la journée : j'ai refermé le coffre et rangé la clé dans le tiroir. Les deux clients des derniers dépôts étaient encore devant moi : l'un attendait ses horaires de train, l'autre son reçu. Mme Ferrand m'a demandé de ne donner son numéro de chambre à personne, « même si l'on insiste ».",
        ],
        [
          "Ce matin ?",
          "À 7 heures, j'ai ouvert le coffre avec M. Castellane. Tout avait disparu, sauf la mallette de la 7. Vers 8 heures, M. Delaroche est descendu la réclamer : il avait un rendez-vous à Paris. Il était furieux qu'on lui ait aussi volé son pli. M. Castellane a refusé de rendre quoi que ce soit, et de laisser partir qui que ce soit.",
        ],
      ]}
    />
  );
}

export function P04() {
  return (
    <Audition
      piece="P04"
      heure="9 h 40"
      temoin="M. Marcel BONNET, veilleur de nuit."
      signature="M. Bonnet"
      qr={[
        ["Où était la clé du coffre cette nuit ?", "Sur moi, comme le veut le règlement. Elle ne me quitte pas."],
        [
          "Mlle Arnaud dit qu'elle la range dans le tiroir du comptoir.",
          "… Bon. Elle reste dans le tiroir, c'est vrai. Tout le personnel fait comme ça. Je ne quitte jamais le comptoir, alors à quoi bon la porter sur moi ?",
        ],
        [
          "Jamais ?",
          "Sauf pour ma ronde. Chaque nuit, je fais les trois étages et les terrasses. Une bonne demi-heure. Le comptoir reste vide, oui. Mais la porte d'entrée est fermée à clé dès 19 heures, et c'est moi qui ai la clé : personne n'entre et personne ne sort. Personne n'a jamais rien volé pendant ma ronde.",
        ],
        [
          "Qu'avez-vous vu cette nuit ?",
          "En prenant mon service, j'ai monté les valises de la dame du 12. Des étiquettes « O. Marchal, Lyon » dessus, alors qu'elle s'appelle Ferrand au registre. Vers minuit, cette même dame est descendue en robe de chambre. Elle a mis une lettre dans la boîte du hall et elle est remontée aussitôt.",
        ],
        [
          "Et pendant votre ronde ?",
          "Au premier, en passant devant le 12, la dame m'a appelé à travers la porte : elle voulait de l'aspirine. Je lui ai passé deux comprimés par l'entrebâillement. Elle avait l'air de ne pas dormir. Plus loin dans le même couloir, au 7, pas de lumière, pas un bruit : j'ai cru que le monsieur dormait. Quand je suis redescendu, rien n'avait bougé. Le tiroir était fermé, la clé dedans.",
        ],
      ]}
    />
  );
}
