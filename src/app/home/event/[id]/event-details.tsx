import { CalendarDays, MapPin, UserRound } from "lucide-react";
import { EventCommentForm } from "@/components/event/event-comment-form";
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
      new Date(messageB.createdAt).getTime(),
  );

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl lg:text-3xl">
              {event.title}
            </CardTitle>
            <CardDescription className="text-base lg:text-lg">
              {event.description}
            </CardDescription>
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {event.tags.map((tag) => (
                  <Badge key={tag.name}>{tag.name.toUpperCase()}</Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {formatDateTime(event.eventDate)}
              </span>
              <span className="inline-flex items-center gap-2">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                {event.createdBy.name}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {event.location}
              </span>
            </div>
            <Separator className="my-2" decorative={false} />
            <div className="prose prose-sm max-w-none whitespace-pre-wrap dark:prose-invert">
              {event.body}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Participação</CardTitle>
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
                        {PARTICIPATION_SECTION_LABELS[status]}
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

      <Card>
        <CardHeader>
          <CardTitle>Comentários</CardTitle>
          <CardDescription>
            Compartilhe atualizações e dúvidas sobre o evento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EventCommentForm eventId={event.id} />
          <Separator decorative={false} />
          {sortedMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum comentário até o momento. Seja o primeiro a participar da
              conversa!
            </p>
          ) : (
            <div className="space-y-4">
              {sortedMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <AvatarName name={message.sentBy.name} />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium">{message.sentBy.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(message.createdAt, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{message.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
