"use client";

import { useState, useTransition, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PencilIcon } from "lucide-react";
import { updateGroup } from "@/features/groups/actions/update-group";
import { toast } from "sonner";
import { CreateGroupFormState } from "@/features/groups/form-schema/create-group";

interface EditGroupDialogProps {
  groupId: number;
  defaultName: string;
  defaultDescription?: string | null;
}

export function EditGroupDialog({
  groupId,
  defaultName,
  defaultDescription,
}: EditGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreateGroupFormState>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateGroup(groupId, formData);
      setState(result);

      if (result.isSuccess) {
        toast.success(result.message);
        setOpen(false);
      } else if (result.message) {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
            <DialogDescription>
              Faça alterações no nome e descrição do grupo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                defaultValue={defaultName}
                placeholder="Nome do Grupo"
                required
              />
              {state?.errors?.name && (
                <p className="text-sm text-red-600">{state.errors.name[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={defaultDescription || ""}
                placeholder="Uma breve descrição do que será discutido no grupo"
                rows={4}
              />
              {state?.errors?.description && (
                <p className="text-sm text-red-600">
                  {state.errors.description[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Voltar
            </Button>
            {isPending && (
              <Button type="submit" disabled>
                <Loader2 className=" animate-spin" /> Salvando...
              </Button>
            )}
            {!isPending && <Button type="submit">Salvar Alterações</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
