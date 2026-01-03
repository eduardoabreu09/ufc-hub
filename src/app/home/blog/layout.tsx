import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Leia e publique conteúdos no UFC Hub.",
  openGraph: {
    title: "Blog | UFC Hub",
    description:
      "Explore posts e compartilhe experiências com estudantes da UFC.",
  },
};

export default function GroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
