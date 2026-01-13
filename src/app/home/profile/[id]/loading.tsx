import PageHeader from "@/components/page-header";
import { LoadingProfileSkeleton } from "./page";

export default function LoadingProfilePage() {
  return (
    <PageHeader
      title="Carregando perfil"
      description="Coletando informações do usuário."
    >
      <LoadingProfileSkeleton />
    </PageHeader>
  );
}
