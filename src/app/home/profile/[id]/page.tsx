import AvatarName from "@/components/avatar-name";
import { PostCard } from "@/components/blog/post-card";
import EventCard from "@/components/event/event-card";
import { GroupCard } from "@/components/group/group-card";
import PageHeader from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserProfile } from "@/features/profile/queries/get-user-profile";
import { UserDTO } from "@/types/user";
import { GraduationCap, Mail } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: PageProps<"/home/profile/[id]">) {
  const userId = Number((await params).id);

  if (Number.isNaN(userId)) {
    notFound();
  }

  const profileResult = await getUserProfile(userId);

  if (profileResult.isFailure) {
    if (profileResult.error === "Usuário não encontrado.") {
      notFound();
    }

    return (
      <PageHeader
        title="Perfil do usuário"
        description="Não foi possível carregar o perfil solicitado."
      >
        <p className="text-sm text-destructive">{profileResult.error}</p>
      </PageHeader>
    );
  }

  const { user, recentPosts, sharedEvents, sharedGroups } =
    profileResult.getValue();

  return (
    <PageHeader
      title={`Perfil de ${user.name}`}
      description="Informações, postagens e interesses em comum."
    >
      <div className="flex flex-col gap-10 pb-8">
        <UserSummary user={user} />

        <section className="space-y-4">
          <SectionHeader title="Últimas postagens" />
          {recentPosts.length > 0 ? (
            <div className="flex flex-col items-center gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState message="Este usuário ainda não publicou postagens." />
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Eventos em comum" />
          {sharedEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-12">
              {sharedEvents.map((event, index) => (
                <EventCard key={event.id} event={event} priority={index < 2} />
              ))}
            </div>
          ) : (
            <EmptyState message="Vocês ainda não participam dos mesmos eventos." />
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Grupos em comum" />
          {sharedGroups.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sharedGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhum grupo em comum encontrado." />
          )}
        </section>
      </div>
    </PageHeader>
  );
}

function UserSummary({ user }: { user: UserDTO }) {
  return (
    <Card className="flex flex-col gap-4 border bg-card px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <AvatarName
          name={user.name}
          textSize="text-2xl"
          className="h-16 w-16"
        />
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground md:text-base">
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span>{user.email}</span>
        </div>
        {user.course && (
          <div className="flex items-center gap-2">
            <GraduationCap size={16} />
            <span>{user.course}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function LoadingProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <Card className="flex flex-col gap-4 border bg-card px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-44" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-44" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
