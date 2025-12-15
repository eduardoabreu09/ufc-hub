"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { GroupRole } from "@prisma/client";
import { toast } from "sonner";
import {
  Loader2,
  MoreHorizontalIcon,
  ShieldCheckIcon,
  ShieldMinusIcon,
  UserMinusIcon,
} from "lucide-react";

import { changeMemberRole } from "@/features/groups/actions/change-member-role";
import { removeMember } from "@/features/groups/actions/remove-member";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type MenuAction = "PROMOTE" | "DEMOTE" | "REMOVE";

interface MemberActionsMenuProps {
  groupId: number;
  memberId: number;
  memberName: string;
  currentRole: GroupRole;
}

export function MemberActionsMenu({
  groupId,
  memberId,
  memberName,
  currentRole,
}: MemberActionsMenuProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function runAction(action: MenuAction, e?: MouseEvent<HTMLDivElement>) {
    if (action === "REMOVE") {
      e?.preventDefault();
      setOpen(true);
      return;
    }

    startTransition(async () => {
      let result;
      if (action === "PROMOTE") {
        result = await changeMemberRole(groupId, memberId, GroupRole.ADMIN);
      } else if (action === "DEMOTE") {
        result = await changeMemberRole(groupId, memberId, GroupRole.USER);
      }

      if (!result) {
        return;
      }

      if (result.isSuccess) {
        toast.success(result.message);
      } else if (result.message) {
        toast.error(result.message);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await removeMember(groupId, memberId);
      if (result.isSuccess) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setOpen(false);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Opções do membro</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {currentRole === GroupRole.ADMIN ? (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => runAction("DEMOTE")}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldMinusIcon className="mr-2 h-4 w-4" />
            )}
            Rebaixar para membro
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => runAction("PROMOTE")}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheckIcon className="mr-2 h-4 w-4" />
            )}
            Promover a admin
          </DropdownMenuItem>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              disabled={isPending}
              onClick={(e) => runAction("REMOVE", e)}
              className={"text-destructive focus:text-destructive"}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserMinusIcon className="mr-2 h-4 w-4" />
              )}
              Remover do grupo
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover Membro</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover <strong>{memberName}</strong> do
                grupo?
                <br />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Voltar
              </Button>
              {isPending && (
                <Button
                  type="submit"
                  disabled
                  className="bg-destructive hover:bg-destructive/90"
                >
                  <Loader2 className=" animate-spin" /> Removendo...
                </Button>
              )}
              {!isPending && (
                <Button
                  type="submit"
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Remover
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
