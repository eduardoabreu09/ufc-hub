"use client";

import { useState, useTransition } from "react";
import { removeMember } from "@/features/groups/actions/remove-member";
import { Button } from "@/components/ui/button";
import { Loader2, UserMinusIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface RemoveMemberButtonProps {
  groupId: number;
  memberId: number;
  memberName: string;
}

export default function RemoveMemberButton({
  groupId,
  memberId,
  memberName,
}: RemoveMemberButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await removeMember(groupId, memberId);
      if (result.isSuccess) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
          <UserMinusIcon className="h-3 w-3 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Membro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover <strong>{memberName}</strong> do
            grupo?
            <br />
            Esta ação não pode ser desfeita.
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
  );
}
