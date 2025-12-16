"use client";

import { FormEvent, useState, useTransition } from "react";
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
import { Loader2, PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createGroup } from "@/features/groups/actions/create-group";
import { updateGroup } from "@/features/groups/actions/update-group";
import { CreateGroupFormState } from "@/features/groups/form-schema/create-group";

export type GroupDialogMode = "create" | "edit";

interface GroupDialogData {
  id: number;
  name: string;
  description?: string | null;
}

interface GroupDialogProps {
  mode: GroupDialogMode;
  group?: GroupDialogData;
}

export function GroupDialog({ mode, group }: GroupDialogProps) {
  const isEdit = mode === "edit";
  if (isEdit && !group) return null;

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreateGroupFormState>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = isEdit
        ? await updateGroup(group!.id, formData)
        : await createGroup(formData);

      setState(result);

      if (result.isSuccess) {
        toast.success(result.message);
        setOpen(false);
      } else if (result.message) {
        toast.error(result.message);
      }
    });
  }

  const defaultTrigger = isEdit ? (
    <Button variant="outline" size="sm">
      <PencilIcon className="h-4 w-4 mr-2" />
      Editar
    </Button>
  ) : (
    <Button>
      <PlusIcon className="h-4 w-4 mr-2" />
      Criar Grupo
    </Button>
  );

  const title = isEdit ? "Editar Grupo" : "Criar Novo Grupo";
  const description = isEdit
    ? "Faça alterações no nome e descrição do grupo."
    : "Crie um novo grupo para colaborar com outros colegas";
  const submitLabel = isEdit ? "Salvar Alterações" : "Criar Grupo";
  const pendingLabel = isEdit ? "Salvando..." : "Criando...";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome do Grupo"
                defaultValue={group?.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Uma breve descrição do que será discutido no grupo"
                defaultValue={group?.description ?? ""}
                rows={4}
              />
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
            {isPending ? (
              <Button type="submit" disabled>
                <Loader2 className="animate-spin" /> {pendingLabel}
              </Button>
            ) : (
              <Button type="submit">{submitLabel}</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateGroupDialog() {
  return <GroupDialog mode="create" />;
}

export function EditGroupDialog({ group }: { group: GroupDialogData }) {
  return <GroupDialog mode="edit" group={group} />;
}
