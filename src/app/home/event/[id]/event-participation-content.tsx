"use client";
import AvatarName from "@/components/avatar-name";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventParticipationActions } from "./event-participation-actions";
import { Participation } from "@prisma/client";
import { EventParticipationDTO } from "@/types/event";
import { useSession } from "@/context/session-context";

const PARTICIPATION_SECTION_LABELS: Record<Participation, string> = {
  YES: "Confirmados",
  NO: "Não irão",
  MAYBE: "Talvez",
};

export default function EventParticipationContent({
  eventId,
  participations,
}: {
  eventId: number;
  participations: EventParticipationDTO[] | undefined;
}) {
  const { user } = useSession();

  if (!user?.id || !participations) {
    return null;
  }

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

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Participantes ({participations.length})</CardTitle>
        <CardDescription>
          Escolha uma das opções abaixo para indicar sua disponibilidade.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <EventParticipationActions
          eventId={eventId}
          participations={participations}
        />
        <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
          <div className="space-y-3">
            {(Object.keys(PARTICIPATION_SECTION_LABELS) as Participation[]).map(
              (status) => {
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
              }
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
