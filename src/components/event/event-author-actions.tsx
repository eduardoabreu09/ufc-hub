"use client";

import { useSession } from "@/context/session-context";
import { EditEventDialog } from "./event-dialog";
import { DeleteEventDialog } from "./delete-event-dialog";
import { EventDetailsDTO } from "@/types/event";

interface EventProps {
  event: EventDetailsDTO;
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
