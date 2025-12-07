import { GroupChat } from "@/components/group/group-chat";
import { GroupHeader } from "@/components/group/group-header";
import { GroupHeaderSkeleton } from "@/components/group/group-header-skeleton";
import { Suspense } from "react";

export default async function GroupChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = Number(id);

  return (
    <>
      <Suspense fallback={<GroupHeaderSkeleton />}>
        <GroupHeader groupId={groupId} />
      </Suspense>
      <div className="flex-1 overflow-hidden">
        <GroupChat groupId={groupId} />
      </div>
    </>
  );
}
