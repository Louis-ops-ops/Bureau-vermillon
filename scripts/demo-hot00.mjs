// Démo HOT-00 « Le palace d'azur » : copie les sources texte, convertit les visuels en WebP et
// fabrique les deux ZIP de PDF. Source de vérité : le dossier de l'enquête, hors du site.
// À relancer quand l'enquête change : `npm run demo:hot00`. Les sorties sont versionnées.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const enquete = join(site, "..", "Enquêtes", "Hôtel", "Un vole mystérieux Lvl0");
const sources = join(site, "src/content/demo/hot-00/sources");
const publicDemo = join(site, "public/demo/hot-00");

if (!existsSync(enquete)) {
  console.log(`demo-hot00 : ${enquete} introuvable, rien à faire`);
  process.exit(0);
}
mkdirSync(sources, { recursive: true });
mkdirSync(publicDemo, { recursive: true });

// 1. Sources texte, copiées telles quelles (on ne les modifie jamais ici)
for (const f of ["pieces.md", "livrables-joueurs.md", "registre-et-indices.md", "enveloppe-c-solution.md", "travail/table-de-conversion.md"]) {
  copyFileSync(join(enquete, f), join(sources, basename(f)));
}
console.log("demo-hot00 : sources copiées");

// 2. Visuels : WebP qualité 82. `>` = on réduit, on n'agrandit jamais (les sources font 1024 px).
const VISUELS = [
  ["img-02-p00-case-1.jpg", "p00-case-1.webp", 1600],
  ["img-03-p00-case-2.jpg", "p00-case-2.webp", 1600],
  ["img-04-p00-case-3.jpg", "p00-case-3.webp", 1600],
  ["img-05-p00-case-4.jpg", "p00-case-4.webp", 1600],
  ["img-06-suspect-delaroche.jpg", "suspect-delaroche.webp", 1200],
  ["img-06-suspect-delaroche.jpg", "suspect-delaroche-480.webp", 480],
  ["img-07-suspect-ferrand.jpg", "suspect-ferrand.webp", 1200],
  ["img-07-suspect-ferrand.jpg", "suspect-ferrand-480.webp", 480],
];
try {
  for (const [de, vers, largeur] of VISUELS) {
    execFileSync("magick", [join(enquete, "visuels", de), "-resize", `${largeur}x>`, "-strip", "-quality", "82", join(publicDemo, vers)]);
  }
  console.log("demo-hot00 : visuels convertis");
} catch {
  console.log("demo-hot00 : ImageMagick (magick) absent, visuels non convertis");
}

// 3. ZIP sans dépendance : en-têtes locaux, répertoire central, fin de répertoire (PKZIP 2.0, deflate)
function dateDos(d) {
  const temps = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { temps, date };
}

function zip(fichiers, sortie) {
  const locaux = [];
  const central = [];
  let decalage = 0;
  for (const chemin of fichiers) {
    const nom = Buffer.from(basename(chemin), "utf8");
    const brut = readFileSync(chemin);
    const comprime = deflateRawSync(brut, { level: 9 });
    const crc = crc32(brut);
    const { temps, date } = dateDos(statSync(chemin).mtime);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // noms en UTF-8
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(temps, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comprime.length, 18);
    local.writeUInt32LE(brut.length, 22);
    local.writeUInt16LE(nom.length, 26);
    locaux.push(local, nom, comprime);

    const entree = Buffer.alloc(46);
    entree.writeUInt32LE(0x02014b50, 0);
    entree.writeUInt16LE(20, 4);
    entree.writeUInt16LE(20, 6);
    entree.writeUInt16LE(0x0800, 8);
    entree.writeUInt16LE(8, 10);
    entree.writeUInt16LE(temps, 12);
    entree.writeUInt16LE(date, 14);
    entree.writeUInt32LE(crc, 16);
    entree.writeUInt32LE(comprime.length, 20);
    entree.writeUInt32LE(brut.length, 24);
    entree.writeUInt16LE(nom.length, 28);
    entree.writeUInt32LE(decalage, 42);
    central.push(entree, nom);

    decalage += local.length + nom.length + comprime.length;
  }
  const tailleCentral = central.reduce((s, b) => s + b.length, 0);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(fichiers.length, 8);
  fin.writeUInt16LE(fichiers.length, 10);
  fin.writeUInt32LE(tailleCentral, 12);
  fin.writeUInt32LE(decalage, 16);
  writeFileSync(sortie, Buffer.concat([...locaux, ...central, fin]));
  console.log(`demo-hot00 : ${basename(sortie)} (${fichiers.length} PDF)`);
}

const LOTS = ["1-guide-organisateur", "2-dossier-acte-1", "3-grille-enquete", "4-enveloppe-a", "5-enveloppe-c-solution", "6-registre-et-indices"];
const livrables = join(enquete, "livrables");
zip(LOTS.map((l) => join(livrables, `hot-00-${l}.pdf`)), join(publicDemo, "bureau-vermillon-hot-00-le-palace-d-azur.zip"));
zip(LOTS.map((l) => join(livrables, "eco", `hot-00-${l}-eco.pdf`)), join(publicDemo, "bureau-vermillon-hot-00-le-palace-d-azur-eco.zip"));
