import { CreatePostDialog } from "@/components/blog/create-post-dialog";
import { PostCard } from "@/components/blog/post-card";
import PageHeader from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosts } from "@/features/blog/queries/get-posts";
import type { BlogPostDTO } from "@/types/blog-post";
import { Suspense } from "react";

export default function BlogPage() {
  return (
    <PageHeader
      title="Blog"
      description="Compartilhe experiências e novidades com a comunidade acadêmica."
      DialogComponent={CreatePostDialog}
    >
      <Suspense fallback={<LoadingPosts />}>
        <PostList />
      </Suspense>
    </PageHeader>
  );
}

function LoadingPosts() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="w-full sm:max-w-2xl lg:max-w-3xl rounded-lg border bg-card p-6 shadow-sm space-y-4"
        >
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-7 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function PostList() {
  const postsResult = await getPosts();

  if (!postsResult.isSuccess) {
    return <div>Erro ao carregar postagens.</div>;
  }

  const posts = postsResult.getValue() as BlogPostDTO[];

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhuma postagem encontrada. Seja o primeiro a postar!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-center items-center gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
