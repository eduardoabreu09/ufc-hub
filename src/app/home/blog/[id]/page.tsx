import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPostById } from "@/features/blog/queries/get-post-by-id";
import { CalendarIcon, UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { formatDateTime } from "@/lib/utils";
import { CommentSection } from "@/components/comment-section";
import BlogAuthorActions from "@/components/blog/blog-author-actions";
import { Suspense } from "react";
import { getPostCommentsById } from "@/features/blog/queries/get-post-comments";
import { cacheLife, cacheTag } from "next/cache";
import CommentSectionSkeleton from "@/components/comment-section-skeleton";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { getPosts } from "@/features/blog/queries/get-posts";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateStaticParams() {
  const postsResult = await getPosts();

  if (postsResult.isFailure) {
    return [];
  }

  const posts = postsResult.getValue();

  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export default async function BlogPostPage({
  params,
}: PageProps<"/home/blog/[id]">) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BlogDetails postId={Number(id)} />
      <Suspense fallback={<CommentSectionSkeleton showInput />}>
        <BlogComments postId={Number(id)} />
      </Suspense>
    </div>
  );
}

async function BlogDetails({ postId }: { postId: number }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PostBody postId={postId} />
        <Suspense
          fallback={
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          }
        >
          <BlogAuthorActions postId={postId} />
        </Suspense>
      </div>

      <Separator />

      <PostContent postId={postId} />

      <Separator />
    </div>
  );
}

async function PostBody({ postId }: { postId: number }) {
  "use cache";
  cacheTag("post-details");
  cacheLife("days");

  const postResult = await getPostById(postId);

  if (postResult.isFailure) {
    return null;
  }

  const post = postResult.getValue();

  return (
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
                <Badge key={tag.name}>{tag.name.toUpperCase()}</Badge>
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
  );
}

async function PostContent({ postId }: { postId: number }) {
  "use cache";
  cacheTag("post-details");
  cacheLife("days");

  const postResult = await getPostById(postId);

  if (postResult.isFailure) {
    return null;
  }

  const post = postResult.getValue();

  return (
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
  );
}

async function BlogComments({ postId }: { postId: number }) {
  const [comments, currentUserResult] = await Promise.all([
    getPostCommentsById(postId),
    getCurrentUserId(),
  ]);

  return (
    <CommentSection
      id={postId}
      comments={comments}
      showInput={currentUserResult.isSuccess}
      type="blog"
    />
  );
}
