import { getEvents } from "@/features/events/queries/get-events";
import { Suspense } from "react";
import PageHeader from "@/components/page-header";
import { CreateEventDialog } from "@/components/event/create-event-dialog";
import EventCard from "@/components/event/event-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-12">
      {[...Array(6)].map((_, i) => (
        <Card
          key={i}
          className="hover:shadow-lg transition-shadow duration-200 order-last sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2 px-6"
        >
          <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
            <div className="sm:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex flex-col max-w-80 rounded-lg border border-dashed border-border bg-muted/40 p-4 gap-3">
                  <Skeleton className="h-3 w-32" />
                  <div className="flex justify-around items-center gap-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="order-first sm:order-last sm:col-span-5">
              <div className="aspect-16/9 overflow-clip rounded-lg border border-border">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          </div>
        </Card>
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
