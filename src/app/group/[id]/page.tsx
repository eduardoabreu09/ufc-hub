import AddMemberDialog from "@/components/group/add-member-dialog";
import { GroupChat } from "@/components/group/group-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getGroupById } from "@/features/groups/queries/get-group-by-id";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { GroupRole } from "@prisma/client";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function GroupChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
      <Suspense fallback={<LoadingHeader />}>
        <GroupNameHeader groupId={Number(id)} />
      </Suspense>
      <Suspense fallback={<LoadingChat />}>
        <GroupBody groupId={Number(id)} />
      </Suspense>
    </div>
  );
}
function LoadingHeader() {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-6 py-8 space-y-2">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-4 items-center">
            <Skeleton className="h-4 w-16"></Skeleton>
            <Skeleton className="h-4 w-20"></Skeleton>
          </div>
          <Skeleton className="h-9 w-full max-w-35"></Skeleton>
        </div>
      </div>
      <div className="border rounded-lg p-6 py-8 space-y-4 sm:space-y-8">
        <Skeleton className="h-4 w-24"></Skeleton>
        <div className="flex gap-2 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20"></Skeleton>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingChat() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex gap-2 sm:gap-4 items-center">
        <Label className="text-lg font-semibold">Chat</Label>
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col border rounded-lg max-w-26 pl-2 py-2 gap-2"
          >
            <Skeleton className="h-4 w-16"></Skeleton>
            <Skeleton className="h-4 w-16"></Skeleton>
            <Skeleton className="h-4 w-16"></Skeleton>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          name="content"
          placeholder="Type your message..."
          disabled
          className="flex-1"
          required
        />
        <Button type="submit" disabled>
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

async function GroupNameHeader({ groupId }: { groupId: number }) {
  const group = await getGroupById(groupId);
  const currentUserId = await getCurrentUserId();

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Group not found or you do not have access.</p>
      </div>
    );
  }

  const isAdmin = group.users.some(
    (ug) => ug.userId === currentUserId && ug.role === GroupRole.ADMIN
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col w-full sm:flex-row justify-between sm:items-center">
            <div className="flex items-center gap-4 max-sm:mb-4">
              <Link href="/group">
                <Button variant="ghost" size="sm">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>

              <div>
                <CardTitle className="flex items-center gap-2">
                  {group.name}
                  {isAdmin && <Badge variant="secondary">Admin</Badge>}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {group.description}
                </p>
              </div>
            </div>
            {isAdmin && <AddMemberDialog groupId={group.id} />}
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Members ({group.users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {group.users.map((userGroup) => (
              <Badge
                key={userGroup.userId}
                variant={
                  userGroup.role === GroupRole.ADMIN ? "default" : "secondary"
                }
              >
                {userGroup.user.name}
                {userGroup.role === GroupRole.ADMIN && " (Admin)"}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

async function GroupBody({ groupId }: { groupId: number }) {
  const group = await getGroupById(groupId);
  const currentUserId = await getCurrentUserId();

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Group not found or you do not have access.</p>
      </div>
    );
  }

  return <GroupChat group={group} currentUserId={currentUserId} />;
}
