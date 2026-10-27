import { Nav } from "@/components/Nav";
import { Bandeau } from "@/components/sections/Bandeau";
import { Etapes } from "@/components/sections/Etapes";
import { Extrait } from "@/components/sections/Extrait";
import { Faq } from "@/components/sections/Faq";
import { Gratuit } from "@/components/sections/Gratuit";
import { Hero } from "@/components/sections/Hero";
import { Pied } from "@/components/sections/Pied";
import { Recois } from "@/components/sections/Recois";
import { Resolution } from "@/components/sections/Resolution";
import { Suspects } from "@/components/sections/Suspects";
import { Univers } from "@/components/sections/Univers";

export default function Accueil() {
  return (
    <>
      <Nav />
      <main id="contenu" tabIndex={-1}>
        <Hero />
        <Bandeau />
        <Recois />
        <Etapes />
        <Univers />
        <Extrait />
        <Suspects />
        <Resolution />
        <Faq />
        <Gratuit />
      </main>
      <Pied />
    </>
  );
}
