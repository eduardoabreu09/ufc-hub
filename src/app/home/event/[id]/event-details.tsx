import { CalendarIcon, Clock, MapPin, UserIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Participation } from "@prisma/client";
import { formatDateTime } from "@/lib/utils";
import AvatarName from "@/components/avatar-name";
import { EventMessageDTO, EventParticipationDTO } from "@/types/event";
import { EventParticipationActions } from "./event-participation-actions";
import { CommentSection } from "@/components/comment-section";
import { EventAuthorActions } from "@/components/event/event-author-actions";

const PARTICIPATION_SECTION_LABELS: Record<Participation, string> = {
  YES: "Confirmados",
  NO: "Não irão",
  MAYBE: "Talvez",
};

interface EventDetailsProps {
  event: EventMessageDTO;
}

export function EventDetails({ event }: EventDetailsProps) {
  const participations = event.participations ?? [];

  const participationGroups: Record<Participation, EventParticipationDTO[]> = {
    YES: [],
    NO: [],
    MAYBE: [],
  };

  participations.forEach((participation) => {
    if (participation.participation) {
      participationGroups[participation.participation].push(participation);
    }
  });

  const sortedMessages = [...(event.messages ?? [])].sort(
    (messageA, messageB) =>
      new Date(messageA.createdAt).getTime() -
      new Date(messageB.createdAt).getTime()
  );

  return (
    <>
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

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Participantes ({participations.length})</CardTitle>
            <CardDescription>
              Escolha uma das opções abaixo para indicar sua disponibilidade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <EventParticipationActions
              eventId={event.id}
              participations={participations}
            />
            <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              <div className="space-y-3">
                {(
                  Object.keys(PARTICIPATION_SECTION_LABELS) as Participation[]
                ).map((status) => {
                  const users = participationGroups[status];
                  return (
                    <div key={status} className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {PARTICIPATION_SECTION_LABELS[status] +
                          (users.length > 0 ? ` (${users.length})` : "")}
                      </p>
                      {users.length === 0 ? (
                        <p className="text-xs text-muted-foreground/80">
                          Nenhum participante nesta categoria ainda.
                        </p>
                      ) : (
                        <ul className="space-y-1">
                          {users.map((participant) => (
                            <li
                              key={`${status}-${participant.userId}`}
                              className="flex items-center gap-2 text-sm text-foreground"
                            >
                              <AvatarName
                                name={participant.user.name}
                                className="size-7"
                              />
                              <span>{participant.user.name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator />

      <CommentSection
        id={event.id}
        comments={sortedMessages}
        showInput={true}
        type="event"
      />
    </>
  );
}
