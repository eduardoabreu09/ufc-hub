"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Palette,
  Tag,
  Users,
} from "lucide-react";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDialog({ event, isOpen, onClose }: EventDialogProps) {
  const startDate = event?.start ? new Date(event.start) : null;
  const endDate = event?.end ? new Date(event.end) : null;

  // Participation status uses the color field as a lightweight flag
  const participationStatus = (() => {
    if (!event?.color) return null;
    switch (event.color) {
      case "emerald":
        return {
          label: "Confirmado",
          badgeClass:
            "border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-100",
          dotClass: "bg-emerald-600",
        };
      case "red":
        return {
          label: "Recusado",
          badgeClass:
            "border-red-200 bg-red-50 text-red-900 dark:bg-red-950/40 dark:border-red-900 dark:text-red-100",
          dotClass: "bg-red-800",
        };
      case "amber":
      default:
        return {
          label: "Talvez",
          badgeClass:
            "border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-100",
          dotClass: "bg-amber-500",
        };
    }
  })();

  const dateLabel = (() => {
    if (!startDate || !endDate || Number.isNaN(startDate.getTime()))
      return "Data não informada";
    if (Number.isNaN(endDate.getTime()))
      return format(startDate, "dd/MM/yyyy HH:mm");

    if (event?.allDay)
      return `${format(startDate, "dd/MM/yyyy")} • Dia inteiro`;

    const sameDay =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();

    if (sameDay) {
      return `${format(startDate, "dd/MM/yyyy")} • ${format(
        startDate,
        "HH:mm"
      )} - ${format(endDate, "HH:mm")}`;
    }

    return `${format(startDate, "dd/MM/yyyy HH:mm")} - ${format(
      endDate,
      "dd/MM/yyyy HH:mm"
    )}`;
  })();

  const tags = event?.tags ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pt-4">
          <DialogTitle>{event?.title ?? "Título"}</DialogTitle>
          <DialogDescription className="sr-only">
            {event?.description ?? "Descrição do evento"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{dateLabel}</span>
            </div>
            {!event?.allDay &&
            startDate &&
            endDate &&
            !Number.isNaN(startDate.getTime()) &&
            !Number.isNaN(endDate.getTime()) ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                <span>
                  Início: {format(startDate, "HH:mm")} • Fim:{" "}
                  {format(endDate, "HH:mm")}
                </span>
              </div>
            ) : null}
            {event?.location ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            ) : null}
          </div>

          {event?.description ? (
            <div>
              <p className="font-medium">Descrição</p>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          ) : null}

          {participationStatus && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 py-1 text-xs font-semibold`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${participationStatus.dotClass}`}
                  aria-hidden
                />
                <span>Sua participação: </span>
                <Badge className={participationStatus.badgeClass}>
                  {participationStatus.label}
                </Badge>
              </div>
            </div>
          )}

          {tags.length ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-2 py-2">
            {event?.createdBy ? (
              <div className="text-sm">
                <span className="font-medium">Criado por:</span>{" "}
                {event.createdBy}
              </div>
            ) : null}
            {event?.creatorCourse ? (
              <div className="text-sm text-muted-foreground">
                Curso: {event.creatorCourse}
              </div>
            ) : null}
            {typeof event?.participations === "number" ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {event.participations} participação
                  {event.participations === 1 ? "" : "s"}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <DialogFooter className="flex-row justify-between">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {event?.id ? (
            <Button asChild variant="secondary">
              <Link href={`/home/event/${event.id}`}>Ver evento</Link>
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
