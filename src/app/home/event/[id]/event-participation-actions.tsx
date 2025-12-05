"use client";

import ParticipateDialog from "@/components/event/participate-dialog";
import { useSession } from "@/context/session-context";
import { EventParticipationDTO } from "@/types/event";

interface EventParticipationActionsProps {
  eventId: number;
  participations: EventParticipationDTO[];
}

export function EventParticipationActions({
  eventId,
  participations,
}: EventParticipationActionsProps) {
  const { user } = useSession();

  const selectedParticipation =
    participations.find((participant) => participant.userId === user?.id)
      ?.participation ?? undefined;

  return (
    <div className="grid grid-cols-3 gap-2">
      <ParticipateDialog
        eventId={eventId}
        type="YES"
        selected={selectedParticipation}
      />
      <ParticipateDialog
        eventId={eventId}
        type="NO"
        selected={selectedParticipation}
      />
      <ParticipateDialog
        eventId={eventId}
        type="MAYBE"
        selected={selectedParticipation}
      />
    </div>
  );
}
