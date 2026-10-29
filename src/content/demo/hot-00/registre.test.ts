// Contrôles du registre HOT-00 (brief, section 6.3), à partir du JSON servi au joueur.
import { describe, expect, it } from "vitest";
import { trouver, type DonneesRegistre } from "@/lib/demo/registre";
import donnees from "./registre.json";

const data = donnees as DonneesRegistre;
const tous = [...data.registre, ...data.indices];
const NOMS = [1, 2, 3, 4, 5, 6, 7];
const PLUS_PETIT_DABORD = "Non. Relisez la règle : le plus petit numéro d'abord.";

describe("registre HOT-00", () => {
  it("acte 1 : les 21 paires (plus petit d'abord) mènent toutes à un § existant, et seule 56 est juste", () => {
    const paires: number[] = [];
    for (const a of NOMS) for (const b of NOMS) if (a < b) paires.push(a * 10 + b);
    expect(paires).toHaveLength(21);
    expect(new Set(paires).size).toBe(21);

    for (const paire of paires) {
      const p = trouver(data, 100 + paire);
      expect(p, `§ ${100 + paire}`).toBeDefined();
      expect(p!.type === "juste", `§ ${100 + paire}`).toBe(paire === 56);
    }
  });

  it("acte 1 : les 6 paires inversées des clients renvoient à « le plus petit numéro d'abord »", () => {
    for (const paire of [52, 62, 65, 72, 75, 76]) {
      expect(trouver(data, 100 + paire)?.t, `§ ${100 + paire}`).toBe(PLUS_PETIT_DABORD);
    }
  });

  it("acte 2 : 301 à 307 existent, seul 305 est juste", () => {
    for (let n = 301; n <= 307; n++) {
      const p = trouver(data, n);
      expect(p, `§ ${n}`).toBeDefined();
      expect(p!.type === "juste", `§ ${n}`).toBe(n === 305);
      expect(p!.effet).toBe("verificationActe2");
    }
  });

  it("chaque renvoi pointe vers un § existant", () => {
    for (const p of tous.filter((p) => p.renvoi !== undefined)) {
      expect(trouver(data, p.renvoi!), `§ ${p.n} → § ${p.renvoi}`).toBeDefined();
    }
  });

  it("le § 207 de l'exemple de la grille n'existe pas", () => {
    expect(trouver(data, 207)).toBeUndefined();
  });

  it("aucun numéro en double", () => {
    const numeros = tous.map((p) => p.n);
    expect(new Set(numeros).size).toBe(numeros.length);
  });

  it("les tête-bêche sont 156, 305 et les cinq indices finaux", () => {
    const tetesBeche = tous.filter((p) => p.teteBeche).map((p) => p.n).sort((a, b) => a - b);
    expect(tetesBeche).toEqual([156, 305, 537, 572, 618, 649, 684]);
    expect(tous.filter((p) => p.type === "indice-final").every((p) => p.teteBeche)).toBe(true);
  });

  it("le registre reste entre 100 et 499, les indices entre 500 et 999", () => {
    expect(data.registre.every((p) => p.n >= 100 && p.n < 500)).toBe(true);
    expect(data.indices.every((p) => p.n >= 500 && p.n <= 999)).toBe(true);
  });
});
