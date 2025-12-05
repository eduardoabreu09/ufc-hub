"use client";

import AddMemberDialog from "@/components/group/add-member-dialog";
import DeleteGroupDialog from "@/components/group/delete-group-dialog";
import RemoveMemberButton from "@/components/group/remove-member-button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/context/session-context";
import { GroupMessagesDTO } from "@/types/group";
import { GroupRole } from "@prisma/client";

interface GroupProps {
  group: GroupMessagesDTO;
}

export function GroupAdminBadge({ group }: GroupProps) {
  const { user } = useSession();

  if (!user) return null;

  const isAdmin = group.users.some(
    (ug) => ug.userId === user.id && ug.role === GroupRole.ADMIN,
  );

  if (!isAdmin) return null;

  return <Badge variant="secondary">Admin</Badge>;
}

export function GroupHeaderActions({ group }: GroupProps) {
  const { user } = useSession();

  if (!user) return null;

  const isAdmin = group.users.some(
    (ug) => ug.userId === user.id && ug.role === GroupRole.ADMIN,
  );

  const isOwner = group.creatorId === user.id;

  return (
    <div className="flex gap-2 max-sm:flex-col">
      {isAdmin && <AddMemberDialog groupId={group.id} />}
      {isOwner && (
        <DeleteGroupDialog groupId={group.id} groupName={group.name} />
      )}
    </div>
  );
}

interface GroupMemberRemoveButtonProps {
  group: GroupMessagesDTO;
  memberId: number;
  memberName: string;
}

export function GroupMemberRemoveButton({
  group,
  memberId,
  memberName,
}: GroupMemberRemoveButtonProps) {
  const { user } = useSession();

  if (!user) return null;

  const isAdmin = group.users.some(
    (ug) => ug.userId === user.id && ug.role === GroupRole.ADMIN,
  );

  if (user.id === memberId) return null;

  if (!isAdmin) return null;

  return (
    <RemoveMemberButton
      groupId={group.id}
      memberId={memberId}
      memberName={memberName}
    />
  );
}
