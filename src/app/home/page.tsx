import { PostCard } from "@/components/blog/post-card";
import { GroupCard } from "@/components/group/group-card";
import { EventGallery } from "@/components/home/event-carousel";
import PageHeader from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { getGroups } from "@/features/groups/queries/get-groups";
import { getHomeEvents } from "@/features/home/queries/get-home-events";
import { getHomePosts } from "@/features/home/queries/get-home-posts";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Resumo com eventos, grupos e posts mais recentes para a comunidade da UFC.",
  openGraph: {
    title: "Início | UFC Hub",
    description:
      "Veja eventos, grupos e últimas publicações da comunidade da UFC.",
  },
};

export default function Home() {
  return (
    <PageHeader
      title="Bem-vindo ao UFC hub"
      description="Seu portal central para eventos, notícias e recursos da universidade."
    >
      <div className="flex flex-col gap-10">
        <EventList />
        <PostList />
        <Suspense fallback={<LoadingGroupList />}>
          <GroupList />
        </Suspense>
      </div>
    </PageHeader>
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
  "use cache";
  cacheTag("event-list");

  const eventsResult = await getHomeEvents();

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
  "use cache";
  cacheTag("post-list");

  const postsResult = await getHomePosts();

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
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
