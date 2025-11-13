import { Skeleton } from "@/components/ui/skeleton";
import { getEvents } from "@/features/events/queries/get-events";
import { Suspense } from "react";
import PageHeader from "@/components/page-header";
import { CreateEventDialog } from "@/components/event/create-event-dialog";
import EventCard from "@/components/event/event-card";

export default function EventsPage() {
  return (
    <PageHeader
      title="Eventos"
      description="Crie e participe de eventos da universidade."
      DialogComponent={CreateEventDialog}
    >
      <Suspense fallback={<Loading />}>
        <EventList />
      </Suspense>
    </PageHeader>
  );
}

function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-3/4"></Skeleton>
          <Skeleton className="h-4 w-full"></Skeleton>
          <Skeleton className="h-4 w-2/3"></Skeleton>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20"></Skeleton>
            <Skeleton className="h-4 w-24"></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
}

async function EventList() {
  const eventsResult = await getEvents();

  if (eventsResult.isFailure) {
    return null;
  }

  const events = eventsResult.getValue();

  return (
    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-12">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
