"use client";

import { useState, useEffect } from "react";
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

interface AddMemberDialogProps {
  groupId: number;
}

export default function AddMemberDialog({ groupId }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    addMember.bind(null, groupId),
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state?.success]);

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
            {state?.message && !state.success && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {state.message}
              </div>
            )}
            {state?.success && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                {state.message}
              </div>
            )}
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
