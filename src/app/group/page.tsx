import { CreateGroupDialog } from "@/components/group/create-group-dialog";
import { GroupCard } from "@/components/group/group-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGroups } from "@/features/groups/queries/get-groups";
import { Suspense } from "react";

export default function GroupsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground mt-2">
            Create and join groups to collaborate with other students
          </p>
        </div>
        <CreateGroupDialog />
      </div>
      <Suspense fallback={<Loading />}>
        <GroupList />
      </Suspense>
    </div>
  );
}

async function GroupList() {
  const groups = await getGroups();

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          No groups yet. Create your first group to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}

function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-3/4"></Skeleton>
          <Skeleton className="h-4 w-full"></Skeleton>
          <Skeleton className="h-4 w-2/3"></Skeleton>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20"></Skeleton>
            <Skeleton className="h-4 w-24"></Skeleton>
          </div>
          <Skeleton className="h-9 w-full"></Skeleton>
        </div>
      ))}
    </div>
  );
}
