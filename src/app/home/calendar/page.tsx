import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendário",
  description:
    "Visualize e acompanhe os eventos acadêmicos na sua agenda do UFC Hub.",
};

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <span className="mb-4 block text-2xl font-bold">
        Calendário de Eventos
      </span>
    </div>
  );
}
