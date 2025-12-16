"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/features/blog/actions/delete-post";
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
import { Loader2, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePostDialogProps {
  postId: number;
  postTitle: string;
}

export function DeletePostDialog({ postId, postTitle }: DeletePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePost(postId);
      if (result.isSuccess) {
        toast.success(result.message);
        setOpen(false);
        router.push("/home/blog"); // Redirect to blog list after deletion
      } else {
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
          <DialogTitle>Deletar Postagem</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar a postagem{" "}
            <strong>{postTitle}</strong>?
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
