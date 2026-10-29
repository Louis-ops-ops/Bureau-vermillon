import { describe, expect, it } from "vitest";
import donnees from "@/content/demo/hot-00/registre.json";
import { gradePour, nomCourt } from "@/content/demo/hot-00/grades";
import { etatInitial, indicesLus, normaliser, reducer, score, type Action, type EtatDemo } from "./etat";
import { consulter, libelleRenvoi, trouver, type DonneesRegistre } from "./registre";

const data = donnees as DonneesRegistre;
const jouer = (...actions: Action[]) => actions.reduce<EtatDemo | null>(reducer, etatInitial(0))!;

describe("registre : ce que voit le joueur", () => {
  const depart = etatInitial(0);

  it("hors plage et vide", () => {
    expect(consulter(99, depart, data).cas).toBe("hors-plage");
    expect(consulter(1000, depart, data).cas).toBe("hors-plage");
    expect(consulter(Number.NaN, depart, data).cas).toBe("hors-plage");
  });

  it("§ 207 n'existe pas", () => {
    expect(consulter(207, depart, data)).toEqual({ cas: "inexistant", n: 207 });
  });

  it("§ 305 pendant l'acte 1 : signez d'abord", () => {
    expect(consulter(305, depart, data).cas).toBe("non-signee");
  });

  it("après la vérification : on relit la sienne, pas une autre", () => {
    const e = jouer({ type: "coupable", n: 5 }, { type: "signer", now: 10 }, { type: "lire", n: 305, now: 20 });
    expect(e.verificationActe2).toBe(305);
    expect(e.finActe2).toBe(20);
    expect(consulter(301, e, data).cas).toBe("deja-verifie");
    expect(consulter(305, e, data).cas).toBe("paragraphe");
  });

  it("libellés des renvois", () => {
    expect(libelleRenvoi(trouver(data, 157)!)).toBe("→ Indice § 742");
    expect(libelleRenvoi(trouver(data, 742)!)).toBe("Toujours bloqués ? → § 618");
    expect(libelleRenvoi(trouver(data, 165)!)).toBeNull();
  });
});

describe("reducer : garde-fous", () => {
  it("pas d'enveloppe A sans le § 156 retourné", () => {
    const e = jouer({ type: "aller", etape: "acte1" }, { type: "aller", etape: "enveloppeA" });
    expect(e.etape).toBe("acte1");
    const f = reducer(e, { type: "retourner", n: 156, now: 5 })!;
    expect(f.finActe1).toBe(5);
    expect(reducer(f, { type: "aller", etape: "enveloppeA" })!.etape).toBe("enveloppeA");
  });

  it("pas d'enveloppe C sans vérification, pas de vérification sans signature", () => {
    const e = jouer({ type: "retourner", n: 156, now: 1 }, { type: "aller", etape: "acte2" }, { type: "lire", n: 305, now: 2 });
    expect(e.verificationActe2).toBeUndefined();
    expect(reducer(e, { type: "aller", etape: "enveloppeC" })!.etape).toBe("acte2");
  });

  it("signer exige un coupable, puis verrouille l'accusation", () => {
    const sans = jouer({ type: "signer", now: 1 });
    expect(sans.grille.accusation.signeeA).toBeUndefined();
    const e = jouer({ type: "coupable", n: 6 }, { type: "signer", now: 1 }, { type: "coupable", n: 5 }, { type: "accusation", champ: "vraiment", valeur: "x" });
    expect(e.grille.accusation).toEqual({ coupable: 6, signeeA: 1 });
  });

  it("le calcul du § reste modifiable après la signature, pas l'accusation", () => {
    const e = jouer(
      { type: "coupable", n: 5 },
      { type: "signer", now: 1 },
      { type: "accusation", champ: "calcul", valeur: "305" },
      { type: "accusation", champ: "cherchait", valeur: "x" },
    );
    expect(e.grille.accusation.calcul).toBe("305");
    expect(e.grille.accusation.cherchait).toBeUndefined();
  });

  it("un indice retourné deux fois ne compte qu'une fois", () => {
    const e = jouer({ type: "retourner", n: 618, now: 1 }, { type: "retourner", n: 618, now: 2 }, { type: "retourner", n: 156, now: 3 });
    expect(indicesLus(e)).toBe(1);
  });

  it("un stockage trafiqué redescend à la dernière étape possible", () => {
    expect(normaliser({ ...etatInitial(0), etape: "solution" })!.etape).toBe("acte1");
    expect(normaliser({ ...etatInitial(0), version: 1 })).toBeNull();
    expect(normaliser("{")).toBeNull();
  });
});

describe("barème et grades", () => {
  const verifie = (n: number) => [{ type: "coupable", n: 5 }, { type: "signer", now: 1 }, { type: "lire", n, now: 2 }] as Action[];
  const coche = (...cles: string[]) => cles.map((cle) => ({ type: "bareme", cle, valeur: true }) as Action);
  const retourne = (...ns: number[]) => ns.map((n) => ({ type: "retourner", n, now: 3 }) as Action);

  it("12 points : Commissaire", () => {
    const e = jouer(...verifie(305), ...coche("vraiment", "cherchait", "comment-cle", "comment-butin", "piece-p06", "piece-jd", "piece-p04"));
    expect(score(e)).toBe(12);
    expect(nomCourt(gradePour(12))).toBe("Commissaire du Bureau Vermillon");
  });

  it("9 points : Inspecteur principal (2 indices lus)", () => {
    const e = jouer(...verifie(305), ...coche("vraiment", "cherchait", "comment-cle", "piece-p06", "piece-jd", "piece-p04"), ...retourne(537, 618, 156, 305));
    expect(score(e)).toBe(9);
    expect(gradePour(9).nom).toBe("Inspecteur principal.");
  });

  it("6 points : Enquêteur stagiaire (coupable manqué)", () => {
    const e = jouer(...verifie(306), ...coche("vraiment", "cherchait", "comment-cle", "comment-butin"));
    expect(score(e)).toBe(6);
    expect(gradePour(6).nom).toBe("Enquêteur stagiaire.");
  });

  it("2 points : Veilleur de nuit, et jamais sous zéro", () => {
    const e = jouer(...verifie(305), ...retourne(618));
    expect(score(e)).toBe(2);
    expect(gradePour(2).nom).toBe("Veilleur de nuit.");
    const f = jouer(...verifie(301), ...retourne(537, 572, 618));
    expect(score(f)).toBe(0);
  });
});
