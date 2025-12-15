"use client";

import AddMemberDialog from "@/components/group/add-member-dialog";
import DeleteGroupDialog from "@/components/group/delete-group-dialog";
import { Badge } from "@/components/ui/badge";
import { EditGroupDialog } from "./edit-group-dialog";
import { MemberActionsMenu } from "./member-actions-menu";
import { useSession } from "@/context/session-context";
import { GroupMessagesDTO } from "@/types/group";
import { GroupRole } from "@prisma/client";

interface GroupProps {
  group: GroupMessagesDTO;
}

export function IsYouBadge({ userId }: { userId: number }) {
  const { user } = useSession();

  if (!user) return null;

  const isYou = user.id === userId;

  if (!isYou) return null;

  return <Badge variant="secondary">Você</Badge>;
}

export function GroupHeaderActions({ group }: GroupProps) {
  const { user } = useSession();

  if (!user) return null;

  const isAdmin = group.users.some(
    (ug) => ug.userId === user.id && ug.role === GroupRole.ADMIN
  );

  const isOwner = group.creatorId === user.id;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {isAdmin && <AddMemberDialog groupId={group.id} />}
      {isOwner && (
        <>
          <EditGroupDialog
            groupId={group.id}
            defaultName={group.name}
            defaultDescription={group.description}
          />
          <DeleteGroupDialog groupId={group.id} groupName={group.name} />
        </>
      )}
    </div>
  );
}

interface GroupMemberManagerProps {
  group: GroupMessagesDTO;
  memberId: number;
  memberName: string;
}

export function GroupMemberManager({
  group,
  memberId,
  memberName,
}: GroupMemberManagerProps) {
  const { user } = useSession();

  if (!user) return null;

  const isAdmin = group.users.some(
    (ug) => ug.userId === user.id && ug.role === GroupRole.ADMIN
  );

  // Cannot manage yourself
  if (user.id === memberId) return null;

  if (!isAdmin) return null;

  const targetMember = group.users.find((u) => u.userId === memberId);

  if (!targetMember) return null;

  // Cannot perform actions on the group creator
  if (group.creatorId === memberId) return null;

  return (
    <MemberActionsMenu
      groupId={group.id}
      memberId={memberId}
      memberName={memberName}
      currentRole={targetMember.role}
    />
  );
}
