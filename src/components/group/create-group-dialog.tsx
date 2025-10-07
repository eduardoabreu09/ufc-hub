"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
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
import { Loader2, PlusIcon } from "lucide-react";
import { createGroup } from "@/features/groups/actions/create-group";
import { toast } from "sonner";

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createGroup, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const previousStateRef = useRef(state);

  useEffect(() => {
    if (state?.success && state !== previousStateRef.current) {
      toast.success(state.message);
      setOpen(false);
      formRef.current?.reset();
    }
    if (
      !state?.success &&
      state !== previousStateRef.current &&
      state?.message
    ) {
      toast.error(state.message);
    }
    previousStateRef.current = state;
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Criar Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction} ref={formRef}>
          <DialogHeader>
            <DialogTitle>Criar Novo Grupo</DialogTitle>
            <DialogDescription>
              Crie um novo grupo para colaborar com outros colegas
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome do Grupo"
                required
              />
              {state?.errors?.name && (
                <p className="text-sm text-red-600">{state.errors.name[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Opicional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Uma breve descrição do que será discutido no grupo"
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
            {isPending && (
              <Button type="submit" disabled>
                <Loader2 className=" animate-spin" /> Criando...
              </Button>
            )}
            {!isPending && <Button type="submit">Criar Grupo</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
