import SignupForm from "@/components/signup-form";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Cadastre-se no UFC Hub para participar de grupos, eventos e discussões acadêmicas.",
  openGraph: {
    title: "Criar conta | UFC Hub",
    description: "Crie sua conta e conecte-se à comunidade acadêmica da UFC.",
  },
};

export default async function Signup() {
  "use cache";
  cacheLife("max");
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </main>
  );
}
