"use client";

import { useState, useTransition } from "react";
import { deleteGroup } from "@/features/groups/actions/delete-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteGroupDialogProps {
  groupId: number;
  groupName: string;
}

export default function DeleteGroupDialog({
  groupId,
  groupName,
}: DeleteGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteGroup(groupId);
      if (result.isSuccess) {
        toast.success(result.message);
        router.push("/home/group");
      } else {
        toast.error(result.message);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon className="h-4 w-4 mr-2" />
          Deletar Grupo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Grupo</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="flex flex-col gap-2">
            <p>
              Tem certeza que deseja deletar o grupo{" "}
              <strong>
                {`"`}
                {groupName}
                {`"`}
              </strong>
              ?
            </p>
            <p className="text-red-600 font-medium">
              Esta ação é irreversível e irá:
            </p>
            <div className="flex flex-col text-red-600 gap-1">
              <p>- Remover todos os membros do grupo</p>
              <p>- Deletar todas as mensagens do grupo</p>
              <p>- Excluir permanentemente o grupo</p>
            </div>
          </div>
        </DialogDescription>
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
              <Loader2 className=" animate-spin" /> Deletando...
            </Button>
          )}
          {!isPending && (
            <Button
              type="submit"
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Deletar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
