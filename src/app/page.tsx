import type { Metadata } from "next";
import LoginPage from "./login/page";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesse o UFC Hub para colaborar com grupos, eventos e blog da universidade.",
};

export default function Home() {
  return <LoginPage />;
}
