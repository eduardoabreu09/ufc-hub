"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteEvent } from "@/features/events/actions/delete-event";
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

interface DeleteEventDialogProps {
  eventId: number;
  eventTitle: string;
}

export function DeleteEventDialog({
  eventId,
  eventTitle,
}: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEvent(eventId);
      if (result.isSuccess) {
        toast.success(result.message);
        setOpen(false);
        router.push("/home/event");
      } else if (result.message) {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <TrashIcon className="h-4 w-4 mr-2" />
          Deletar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Evento</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar o evento{" "}
            <strong>{eventTitle}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          {isPending ? (
            <Button
              type="button"
              disabled
              className="bg-destructive hover:bg-destructive/90"
            >
              <Loader2 className="animate-spin" /> Deletando...
            </Button>
          ) : (
            <Button
              type="button"
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
