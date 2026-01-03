import { GroupSidebar } from "@/components/group/group-sidebar";
import { GroupSidebarSkeleton } from "@/components/group/group-sidebar-skeleton";
import { getGroups } from "@/features/groups/queries/get-groups";
import { MessageCircleIcon } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grupos",
  description:
    "Escolha um grupo para acompanhar mensagens e participantes no UFC Hub.",
  openGraph: {
    title: "Grupos | UFC Hub",
    description: "Navegue pelos seus grupos de estudo e comunicação na UFC.",
  },
};

export default function GroupsPage() {
  return (
    <>
      <div className="flex md:hidden h-full w-full shrink-0">
        <Suspense fallback={<GroupSidebarSkeleton />}>
          <GroupsSide />
        </Suspense>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
        <div className="bg-muted/30 p-6 rounded-full mb-4">
          <MessageCircleIcon className="h-12 w-12 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Selecione um grupo
        </h3>
        <p className="max-w-sm mt-2">
          Escolha um grupo na barra lateral para ver as mensagens, participantes
          e mais.
        </p>
      </div>
    </>
  );
}

async function GroupsSide() {
  const groupsResult = await getGroups();
  const groups = groupsResult.isSuccess ? groupsResult.getValue() : [];

  return <GroupSidebar groups={groups} />;
}
