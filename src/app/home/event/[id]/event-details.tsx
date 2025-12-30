import { CalendarIcon, Clock, MapPin, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils";
import { EventAuthorActions } from "@/components/event/event-author-actions";
import { getEventById } from "@/features/events/queries/get-event-by-id";
import { notFound } from "next/navigation";
import EventParticipationContent from "./event-participation-content";
import { cacheTag } from "next/cache";

export async function EventDetails({ eventId }: { eventId: number }) {
  "use cache";
  cacheTag("event-details");

  const eventResult = await getEventById(eventId);

  if (eventResult.isFailure) {
    notFound();
  }

  const event = eventResult.getValue();
  const participations = event.participations ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {formatDateTime(event.eventDate, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {event.tags && event.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag.name} className="text-xs">
                        {tag.name.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-lg text-muted-foreground">{event.description}</p>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-foreground">
                <UserIcon className="h-4 w-4" />
                <span className="font-medium">{event.createdBy.name}</span>
              </div>
              {event.createdBy.course && (
                <>
                  <span>•</span>
                  <span className="font-medium">{event.createdBy.course}</span>
                </>
              )}
              <div className="flex items-center gap-2">
                <span>•</span>
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>Duração: {event.duration} minutos</span>
              </div>
            </div>
          </div>

          <EventAuthorActions event={event} />

          <Separator />
          <div className="prose prose-neutral max-w-none whitespace-pre-wrap dark:prose-invert">
            {event.body}
          </div>
        </div>
        <EventParticipationContent
          eventId={eventId}
          participations={participations}
        />
      </div>
      <Separator />
    </div>
  );
}
