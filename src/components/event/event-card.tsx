import { UserRound, CalendarDays, ArrowRight } from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import { EventDTO } from "@/types/event";
import { Badge } from "../ui/badge";
import ParticipateDialog from "./participate-dialog";
import { Participation } from "@prisma/client";

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
          <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
            <a target="_blank" className="hover:underline">
              {event.title}
            </a>
          </h3>
          <p className="mt-4 text-muted-foreground md:mt-5">
            {event.description}
          </p>
          <div className="mt-6 text-sm md:mt-8">
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <div className="flex  items-center">
                <UserRound size={16} />
                <span className="mr-3 ml-1">{event.createdBy.name}</span>
                <CalendarDays size={16} />
                <span className="ml-1">
                  {event.createdAt.toLocaleDateString()}
                </span>
              </div>
              <span>{event._count?.participations} Participantes</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8 items-center">
            <div className="flex flex-col max-w-80 rounded-lg border border-border bg-muted/40 p-4 gap-3 ">
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

          <div className="mt-6 flex items-center space-x-2 md:mt-8">
            <a
              target="_blank"
              className="inline-flex items-center font-semibold hover:underline md:text-base"
            >
              <span>Ver Mais</span>
              <ArrowRight className="ml-2 size-4 transition-transform" />
            </a>
          </div>
        </div>
        <div className="order-first sm:order-last sm:col-span-5">
          <div className="aspect-16/9 overflow-clip rounded-lg border border-border">
            <img
              src={event.imageUrl || "/portrait.png"}
              className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
