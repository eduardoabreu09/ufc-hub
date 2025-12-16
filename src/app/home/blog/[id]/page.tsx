import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostById } from "@/features/blog/queries/get-post-by-id";
import { CalendarIcon, UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { CommentSection } from "@/components/comment-section";
import { BlogAuthorActions } from "@/components/blog/blog-author-actions";
import { Suspense } from "react";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Suspense fallback={<LoadingPost />}>
        <BlogDetails postId={postId} />
      </Suspense>
    </div>
  );
}

function LoadingPost() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3 max-w-3xl w-full">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-2" />
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>

          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-10/12" />
        <Skeleton className="h-64 w-full" />
      </div>

      <Separator />

      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-9/12" />
        </div>
      </div>
    </div>
  );
}

async function BlogDetails({ postId }: { postId: number }) {
  const postResult = await getPostById(postId);

  if (!postResult.isSuccess) {
    notFound();
  }

  const post = postResult.getValue();
  const comments = post.messages ?? [];
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {formatDateTime(post.createdAt)}
            </span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap items-center gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.name} className="text-xs">
                      {tag.name.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.body}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-foreground">
              <UserIcon className="h-4 w-4" />
              <span className="font-medium">{post.author.name}</span>
            </div>
            {post.author.course && (
              <>
                <span>•</span>
                <span className="font-medium">{post.author.course}</span>
              </>
            )}
          </div>
        </div>

        <BlogAuthorActions post={post} />
      </div>

      <Separator />

      <article
        className="prose prose-neutral max-w-none dark:prose-invert 
        prose-img:rounded-xl prose-a:text-primary prose-li:text-foreground
        prose-h1:font-bold prose-h1:border-b prose-h1:border-foreground/30 prose-h1:pb-2
        prose-h2:border-b prose-h2:border-foreground/30 prose-h2:pb-2
        prose-pre:bg-muted prose-pre:rounded-lg prose-pre:shadow-md
        prose-code:text-foreground"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {post.content}
        </ReactMarkdown>
      </article>

      <Separator />

      <CommentSection
        id={post.id}
        comments={comments}
        showInput={true}
        type="blog"
      />
    </>
  );
}
