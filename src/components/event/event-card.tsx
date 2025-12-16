import Link from "next/link";
import { UserRound, CalendarDays, MapPin, Clock } from "lucide-react";
import { Card } from "../ui/card";
import { EventDTO } from "@/types/event";
import { Badge } from "../ui/badge";
import { formatDateTime } from "@/lib/utils";
import ParticipateDialog from "./participate-dialog";

interface EventCardProps {
  event: EventDTO;
}

export default function EventCard({ event }: EventCardProps) {
  const selectedParticipation = event.participations[0]?.participation;

  return (
    <Card
      key={event.id}
      className="hover:shadow-lg transition-shadow duration-200 order-last sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2 px-6"
    >
      <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-5">
          <div className="mb-4 md:mb-6">
            <div className="flex flex-wrap gap-3 text-xs tracking-wider text-muted-foreground uppercase md:gap-5 lg:gap-6">
              {event.tags.map((tag) => (
                <Badge key={tag.name}>{tag.name}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-1 items-center text-sm text-muted-foreground mb-4 md:text-base">
            <CalendarDays size={16} />
            <span>
              {formatDateTime(event.eventDate, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
            <Link href={`/home/event/${event.id}`} className="hover:underline">
              {event.title}
            </Link>
          </h3>
          <p className="mt-4 text-muted-foreground md:mt-5">
            {event.description}
          </p>
          <div className="mt-6 md:mt-8">
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
              <div className="flex gap-1 items-center">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Clock size={16} />
                <span>Duração: {event.duration} minutos</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-6">
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
              <div className="flex gap-1 items-center">
                <UserRound size={16} />
                <span>{event.createdBy.name}</span>
              </div>
              <div className="flex gap-1 items-center">
                <span>{event._count?.participations} Participantes</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full mt-4 md:mt-6 md:max-w-70 rounded-lg border border-border bg-muted/40 p-4 gap-3 ">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Confirme sua participação
            </p>
            <div className="flex justify-around items-center gap-2">
              <ParticipateDialog
                eventId={event.id}
                type="YES"
                selected={selectedParticipation}
              />
              <ParticipateDialog
                eventId={event.id}
                type="NO"
                selected={selectedParticipation}
              />
              <ParticipateDialog
                eventId={event.id}
                type="MAYBE"
                selected={selectedParticipation}
              />
            </div>
          </div>
        </div>
        <div className="order-first sm:order-last sm:col-span-5">
          <div className="relative aspect-16/9 overflow-clip rounded-lg border border-border bg-muted">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/10">
                  <CalendarDays size={24} />
                </div>
                <span className="text-sm font-medium">Imagem indisponível</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
