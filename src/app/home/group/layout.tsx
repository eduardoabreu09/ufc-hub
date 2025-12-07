import { GroupSidebar } from "@/components/group/group-sidebar";
import { GroupSidebarSkeleton } from "@/components/group/group-sidebar-skeleton";
import { getGroups } from "@/features/groups/queries/get-groups";
import { ReactNode, Suspense } from "react";

export default function GroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <div className="hidden md:flex h-full shrink-0">
        <Suspense fallback={<GroupSidebarSkeleton />}>
          <GroupsSide />
        </Suspense>
      </div>
      <div className="flex-1 h-full overflow-hidden relative flex flex-col bg-muted/10">
        {children}
      </div>
    </div>
  );
}

async function GroupsSide() {
  const groupsResult = await getGroups();
  const groups = groupsResult.isSuccess ? groupsResult.getValue() : [];

  return <GroupSidebar groups={groups} />;
}
