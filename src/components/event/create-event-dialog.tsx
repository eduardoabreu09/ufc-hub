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
import { Loader2, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createEvent } from "@/features/events/actions/create-event";
import DatePicker from "../ui/date-picker";
import { CreateEventFormSchema } from "@/features/events/form-schema/create-event";

export function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreateEventFormSchema>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createEvent(formData);
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
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Criar Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[520px] md:max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Criar Novo Evento</DialogTitle>
            <DialogDescription>
              Crie um novo evento e compartilhe com seus colegas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Título do evento"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Ex.: Auditório Central, Bloco 3"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Data do evento</Label>
                <DatePicker
                  name="eventDate"
                  id="eventDate"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Uma breve descrição do evento"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="body">Detalhes do evento</Label>
              <Textarea
                id="body"
                name="body"
                placeholder="Descreva o evento, incluindo agenda, tema, instruções e links úteis."
                rows={6}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Link da Imagem</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="Ex.: https://www.ufc.br/images/img.png"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="Ex.: Tecnologia, Saúde, Networking, Engenharia"
                required
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
            {!isPending && <Button type="submit">Criar Evento</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
