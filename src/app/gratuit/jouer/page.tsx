import type { Metadata } from "next";
import { Demo } from "@/components/demo/jeu/Demo";

export const metadata: Metadata = {
  title: "Le palace d'azur : la démo en ligne",
  robots: { index: false },
};

export default function Jouer() {
  return <Demo />;
}
