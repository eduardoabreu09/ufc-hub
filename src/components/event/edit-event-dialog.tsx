"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
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
import DatePicker from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateEvent } from "@/features/events/actions/update-event";
import { CreateEventFormSchema } from "@/features/events/form-schema/create-event";
import { EndHour, StartHour } from "@/types/calendar";
import { EventMessageDTO } from "@/types/event";

interface EditEventDialogProps {
  event: EventMessageDTO;
}

export function EditEventDialog({ event }: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreateEventFormSchema>();
  const [isPending, startTransition] = useTransition();

  const defaultStartTime = useMemo(
    () => format(new Date(event.eventDate), "HH:mm"),
    [event.eventDate]
  );

  const defaultTags = useMemo(
    () => event.tags.map((tag) => tag.name).join(", "),
    [event.tags]
  );

  const timeOptions = useMemo(() => {
    const options = [] as { value: string; label: string }[];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "HH:mm");
        options.push({ value: label, label });
      }
    }
    return options;
  }, []);

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);

    startTransition(async () => {
      const result = await updateEvent(event.id, formData);
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
      <DialogContent className="w-full sm:max-w-[520px] md:max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Atualize as informações do seu evento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                defaultValue={event.title}
                placeholder="Título do evento"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                name="location"
                defaultValue={event.location}
                placeholder="Ex.: Auditório Central, Bloco 3"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Data do evento</Label>
                <DatePicker
                  name="eventDate"
                  id="eventDate"
                  required
                  defaultValue={event.eventDate}
                  className="w-full"
                />
              </div>
              <div className="flex gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Início</Label>
                  <Select defaultValue={defaultStartTime} name="startTime">
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Horário de Início</SelectLabel>
                        {timeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duração (Minutos)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    defaultValue={event.duration}
                    placeholder="60"
                    type="number"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={event.description}
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
                defaultValue={event.body}
                placeholder="Descreva o evento, incluindo agenda, tema, instruções e links úteis."
                rows={6}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Link da Imagem de Capa</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={event.imageUrl ?? ""}
                placeholder="Ex.: https://www.ufc.br/images/img.png"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={defaultTags}
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
              Cancelar
            </Button>
            {isPending ? (
              <Button type="submit" disabled>
                <Loader2 className="animate-spin" /> Salvando...
              </Button>
            ) : (
              <Button type="submit">Salvar alterações</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
