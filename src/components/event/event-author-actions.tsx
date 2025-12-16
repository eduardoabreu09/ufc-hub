"use client";

import { useSession } from "@/context/session-context";
import { EventMessageDTO } from "@/types/event";
import { EditEventDialog } from "./edit-event-dialog";
import { DeleteEventDialog } from "./delete-event-dialog";

interface EventProps {
  event: EventMessageDTO;
}

export function EventAuthorActions({ event }: EventProps) {
  const { user } = useSession();

  if (!user) return null;

  const isOwner = event.creatorId === user.id;

  if (!isOwner) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <EditEventDialog event={event} />
      <DeleteEventDialog eventId={event.id} eventTitle={event.title} />
    </div>
  );
}
