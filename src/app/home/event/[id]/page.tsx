import { EventDetails } from "./event-details";
import { Suspense } from "react";
import CommentSectionSkeleton from "@/components/comment-section-skeleton";
import { getEventCommentsById } from "@/features/events/queries/get-event-comments";
import { CommentSection } from "@/components/comment-section";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { getHomeEvents } from "@/features/home/queries/get-home-events";
import { connection } from "next/server";
import { getEventsForCache } from "@/features/events/queries/get-events-for-cache";

export async function generateStaticParams() {
  const [events, homeEventsResult] = await Promise.all([
    getEventsForCache(),
    getHomeEvents(),
  ]);

  if (homeEventsResult.isFailure) {
    return [];
  }

  const homeEvents = homeEventsResult.getValue();

  const allEvents = [...events, ...homeEvents]
    .map((event) => event.id)
    .filter((e, i, self) => i === self.indexOf(e));

  return allEvents.map((id) => ({
    id: id.toString(),
  }));
}

export default async function EventDetailPage({
  params,
}: PageProps<"/home/event/[id]">) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <EventDetails eventId={Number(id)} />
      <Suspense fallback={<CommentSectionSkeleton showInput />}>
        <EventComments eventId={Number(id)} />
      </Suspense>
    </div>
  );
}

async function EventComments({ eventId }: { eventId: number }) {
  await connection();
  const [comments, currentUserResult] = await Promise.all([
    getEventCommentsById(eventId),
    getCurrentUserId(),
  ]);

  return (
    <CommentSection
      id={eventId}
      comments={comments}
      showInput={currentUserResult.isSuccess}
      type="event"
    />
  );
}
