import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Crie, descubra e participe dos eventos da comunidade UFC.",
  openGraph: {
    title: "Eventos | UFC Hub",
    description:
      "Explore eventos da universidade, confirme presença e participe.",
  },
};

export default function GroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
