import { GroupChat } from "@/components/group/group-chat";
import { GroupHeader } from "@/components/group/group-header";
import { GroupHeaderSkeleton } from "@/components/group/group-header-skeleton";
import { Suspense } from "react";

export default async function GroupChatPage({
  params,
}: PageProps<"/home/group/[id]">) {
  return (
    <>
      <Suspense fallback={<GroupHeaderSkeleton />}>
        {params.then(({ id }) => (
          <GroupHeader groupId={Number(id)} />
        ))}
      </Suspense>
      <Suspense fallback={null}>
        {params.then(({ id }) => (
          <div className="flex-1 overflow-hidden">
            <GroupChat groupId={Number(id)} />
          </div>
        ))}
      </Suspense>
    </>
  );
}
