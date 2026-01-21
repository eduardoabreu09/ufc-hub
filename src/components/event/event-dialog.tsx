"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
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
import { createEvent } from "@/features/events/actions/create-event";
import { updateEvent } from "@/features/events/actions/update-event";
import DatePicker from "../ui/date-picker";
import { CreateEventFormSchema } from "@/features/events/form-schema/create-event";
import { EndHour, StartHour } from "@/types/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { EventDetailsDTO } from "@/types/event";

type EventDialogMode = "create" | "edit";

interface EventDialogProps {
  mode: EventDialogMode;
  event?: EventDetailsDTO;
}

export function EventDialog({ mode, event }: EventDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreateEventFormSchema>();
  const [isPending, startTransition] = useTransition();
  const [timezoneOffset, setTimezoneOffset] = useState(0);

  const defaultStartTime = useMemo(() => {
    if (!event) return "12:00";
    const eventDate = new Date(event.eventDate);
    return format(eventDate, "HH:mm");
  }, [event]);

  const defaultTags = useMemo(
    () => event?.tags.map((tag) => tag.name).join(", ") ?? "",
    [event],
  );

  const timeOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        const value = format(date, "HH:mm");
        options.push({ label: value, value });
      }
    }
    return options;
  }, []);

  useEffect(() => {
    // Capture client offset so server can convert local time to UTC correctly.
    setTimezoneOffset(new Date().getTimezoneOffset());
  }, []);

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);

    startTransition(async () => {
      const result =
        mode === "create" && !event
          ? await createEvent(formData)
          : await updateEvent(event!.id, formData);

      setState(result);

      if (result.isSuccess) {
        toast.success(result.message);
        setOpen(false);
      } else if (result.message) {
        toast.error(result.message);
      }
    });
  }

  const isEdit = mode === "edit";
  const title = isEdit ? "Editar Evento" : "Criar Novo Evento";
  const description = isEdit
    ? "Atualize as informações do seu evento."
    : "Crie um novo evento e compartilhe com seus colegas.";
  const submitLabel = isEdit ? "Salvar alterações" : "Criar Evento";
  const pendingLabel = isEdit ? "Salvando..." : "Criando...";

  const defaultTrigger = isEdit ? (
    <Button variant="outline" size="sm">
      <PencilIcon className="h-4 w-4 mr-2" />
      Editar
    </Button>
  ) : (
    <Button>
      <PlusIcon className="h-4 w-4 mr-2" />
      Criar Evento
    </Button>
  );

  if (isEdit && !event) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-[520px] md:max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="hidden"
            name="timezoneOffset"
            value={`${timezoneOffset}`}
          />
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Título do evento"
                defaultValue={event?.title}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ex.: Auditório Central, Bloco 3"
                defaultValue={event?.location}
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
                  defaultValue={event?.eventDate}
                  className="w-full"
                />
              </div>
              <div className="flex gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Início</Label>
                  <Select defaultValue={defaultStartTime} name="startTime">
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Select time" />
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
                    placeholder="60"
                    type="number"
                    defaultValue={event?.duration}
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
                placeholder="Uma breve descrição do evento"
                defaultValue={event?.description}
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
                defaultValue={event?.body}
                rows={6}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Link da Imagem de Capa</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="Ex.: https://www.ufc.br/images/img.png"
                defaultValue={event?.imageUrl ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="Ex.: Tecnologia, Saúde, Networking, Engenharia"
                defaultValue={defaultTags}
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

export function CreateEventDialog() {
  return (
    <Suspense>
      <EventDialog mode="create" />
    </Suspense>
  );
}

export function EditEventDialog({ event }: { event: EventDetailsDTO }) {
  return (
    <Suspense>
      <EventDialog mode="edit" event={event} />
    </Suspense>
  );
}
