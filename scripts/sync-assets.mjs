// Copie le design system et les images WebP du dossier projet vers le site.
// Source de vérité : ../design-system et ../webp. Les copies sont versionnées pour que le site
// se construise seul (Vercel ne voit que ce dossier). Relancer après toute modif du système.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const projet = join(site, "..");

const copies = [
  [join(projet, "design-system/tokens.css"), join(site, "src/styles/ds/tokens.css")],
  [join(projet, "design-system/components/bundle.css"), join(site, "src/styles/ds/bundle.css")],
  [join(projet, "webp"), join(site, "public/img")],
];

for (const [de, vers] of copies) {
  if (!existsSync(de)) {
    console.log(`sync-assets : ${de} introuvable, copie ignorée`);
    continue;
  }
  mkdirSync(dirname(vers), { recursive: true });
  cpSync(de, vers, { recursive: true });
  console.log(`sync-assets : ${de} -> ${vers}`);
}
