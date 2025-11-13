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
import { toast } from "sonner";
import { createEvent } from "@/features/events/actions/create-event";
import DatePicker from "../ui/date-picker";

export function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createEvent, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const previousStateRef = useRef(state);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formVersion, setFormVersion] = useState(0);

  useEffect(() => {
    if (!state || state === previousStateRef.current) {
      return;
    }

    if (state.isSuccess) {
      toast.success(state.message);
      setOpen(false);
      formRef.current?.reset();
      setFormValues({});
      setFormVersion((version) => version + 1);
    } else {
      if (state.payload) {
        const nextValues: Record<string, string> = {};
        state.payload.forEach((value, key) => {
          if (typeof value === "string") {
            nextValues[key] = value;
          }
        });
        setFormValues(nextValues);
        setFormVersion((version) => version + 1);
      }

      if (state.message) {
        toast.error(state.message);
      }
    }

    previousStateRef.current = state;
  }, [state]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      formRef.current?.reset();
      setFormValues({});
      setFormVersion((version) => version + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Criar Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[520px] md:max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <form action={formAction} ref={formRef} className="space-y-6">
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
                key={`title-${formVersion}`}
                defaultValue={formValues.title ?? ""}
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
                  key={`location-${formVersion}`}
                  defaultValue={formValues.location ?? ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Data do evento</Label>
                <DatePicker
                  name="eventDate"
                  id="eventDate"
                  required
                  className="w-full"
                  key={`eventDate-${formVersion}`}
                  defaultValue={formValues.eventDate}
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
                key={`description-${formVersion}`}
                defaultValue={formValues.description ?? ""}
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
                key={`body-${formVersion}`}
                defaultValue={formValues.body ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Link da Imagem</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="Ex.: https://www.ufc.br/images/img.png"
                key={`imageUrl-${formVersion}`}
                defaultValue={formValues.imageUrl ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="Ex.: Tecnologia, Saúde, Networking, Engenharia"
                required
                key={`tags-${formVersion}`}
                defaultValue={formValues.tags ?? ""}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
