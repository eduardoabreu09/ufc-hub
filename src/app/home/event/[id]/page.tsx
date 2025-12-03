import { notFound } from "next/navigation";
import { CalendarDays, MapPin, UserRound } from "lucide-react";
import { getEventById } from "@/features/events/queries/get-event-by-id";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import ParticipateDialog from "@/components/event/participate-dialog";
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
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PARTICIPATION_SECTION_LABELS: Record<Participation, string> = {
  YES: "Confirmados",
  NO: "Não irão",
  MAYBE: "Talvez",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number(id);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Suspense fallback={<LoadingEventBody />}>
        <EventBody eventId={eventId} />
      </Suspense>
    </div>
  );
}

function LoadingEventBody() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap gap-2 pt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-12" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Separator className="my-2" decorative={false} />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="rounded-md border border-dashed p-3 space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-7 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-7 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-5">
          <Skeleton className="h-24 w-full" />
          <Separator decorative={false} />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function EventBody({ eventId }: { eventId: number }) {
  const [eventResult, userIdResult] = await Promise.all([
    getEventById(eventId),
    getCurrentUserId(),
  ]);

  if (eventResult.isFailure || userIdResult.isFailure) {
    notFound();
  }

  const event = eventResult.getValue();
  const currentUserId = userIdResult.getValue();

  const participations = event.participations ?? [];
  const selectedParticipation =
    participations.find((participant) => participant.userId === currentUserId)
      ?.participation ?? undefined;

  const participationGroups: Record<Participation, typeof participations> = {
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
            <div className="grid grid-cols-3 gap-2">
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
