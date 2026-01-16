import { EventParticipationSimpleDTO } from "@/types/event";
import { getEventsForCalendar } from "@/features/events/queries/get-events-calendar";
import { EventColor } from "@/types/calendar";
import { Participation } from "@prisma/client";
import { EventCalendar } from "@/components/ui/event-calendar";
import { Suspense } from "react";
import { CalendarSkeleton } from "@/components/ui/calendar-skeleton";

function getEventColor(
  participations: EventParticipationSimpleDTO[]
): EventColor {
  if (participations.length === 0) {
    return "emerald";
  }

  switch (participations[0].participation) {
    case Participation.YES:
      return "emerald";

    case Participation.MAYBE:
      return "amber";

    case Participation.NO:
      return "red";

    default:
      return "emerald";
  }
}

export default async function Component() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarContent />
    </Suspense>
  );
}

async function CalendarContent() {
  const eventsResult = await getEventsForCalendar();

  const rawEvents = eventsResult.isSuccess ? eventsResult.getValue() : [];

  const events = rawEvents.map((event) => ({
    id: event.id.toString(),
    title: event.title,
    description: event.description,
    start: new Date(event.eventDate),
    end: new Date(event.eventDate.getTime() + event.duration * 60000),
    allDay: event.duration >= 1440,
    color: getEventColor(event.participations),
    location: event.location,
    tags: event.tags.map((tag) => tag.name),
    createdBy: event.createdBy.name,
    creatorCourse: event.createdBy.course ?? "",
    participations: event._count?.participations || 0,
  }));

  return <EventCalendar events={events} />;
}
