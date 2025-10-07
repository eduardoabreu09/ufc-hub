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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlusIcon } from "lucide-react";
import { addMember } from "@/features/groups/actions/add-member";
import { GroupRole } from "@prisma/client";
import { toast } from "sonner";

interface AddMemberDialogProps {
  groupId: number;
}

export default function AddMemberDialog({ groupId }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    addMember.bind(null, groupId),
    undefined
  );
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
        <Button variant="outline" size="sm">
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Adicionar Membro</DialogTitle>
            <DialogDescription>
              Adicione um novo membro ao grupo usando o email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email do Usuário</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-600">{state.errors.email[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select name="role" defaultValue={GroupRole.USER}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GroupRole.USER}>Membro</SelectItem>
                  <SelectItem value={GroupRole.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.role && (
                <p className="text-sm text-red-600">{state.errors.role[0]}</p>
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
                <Loader2 className=" animate-spin" /> Adicionando...
              </Button>
            )}
            {!isPending && <Button type="submit">Adicionar</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
