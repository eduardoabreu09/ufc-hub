import { PostCard } from "@/components/blog/post-card";
import { GroupCard } from "@/components/group/group-card";
import { EventGallery } from "@/components/home/event-carousel";
import PageHeader from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosts } from "@/features/blog/queries/get-posts";
import { getEvents } from "@/features/events/queries/get-events";
import { getGroups } from "@/features/groups/queries/get-groups";
import { Suspense } from "react";

export default function Home() {
  return (
    <PageHeader
      title="Bem-vindo ao UFC hub"
      description="Seu portal central para eventos, notícias e recursos da universidade."
    >
      <div className="flex flex-col gap-10">
        <Suspense fallback={<LoadingEvents />}>
          <EventList />
        </Suspense>
        <Suspense fallback={<LoadingPosts />}>
          <PostList />
        </Suspense>
        <Suspense fallback={<LoadingGroupList />}>
          <GroupList />
        </Suspense>
      </div>
    </PageHeader>
  );
}

function LoadingEvents() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <Skeleton className="h-8 w-56" />
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      <div className="flex w-full gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex w-full shrink-0 flex-col md:max-w-[452px]"
          >
            <div className="aspect-3/2 overflow-hidden rounded-xl">
              <Skeleton className="h-full w-full" />
            </div>
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingPosts() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="w-full rounded-xl border bg-card sm:max-w-2xl lg:max-w-3xl"
        >
          <div className="space-y-4 p-6">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Skeleton className="h-4 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="border-t px-6 py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingGroupList() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="mt-5">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function EventList() {
  const eventsResult = await getEvents();

  if (eventsResult.isFailure) {
    return null;
  }

  const events = eventsResult.getValue();

  if (events.length === 0) {
    return null;
  }

  return <EventGallery events={events} />;
}

async function PostList() {
  const postsResult = await getPosts();

  if (postsResult.isFailure) {
    return null;
  }

  const posts = postsResult.getValue();

  if (posts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold md:text-3xl">
        Últimos Posts no Blog
      </h2>
      <div className="flex flex-col w-full justify-center items-center gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

async function GroupList() {
  const groupResult = await getGroups();

  if (groupResult.isFailure) {
    return null;
  }

  const groups = groupResult.getValue();

  if (groups.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Seus Grupos</h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
