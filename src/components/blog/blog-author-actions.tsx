import { EditPostDialog } from "./blog-dialog";
import { DeletePostDialog } from "./delete-post-dialog";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { getPostById } from "@/features/blog/queries/get-post-by-id";

export default async function BlogAuthorActions({
  postId,
}: {
  postId: number;
}) {
  const [postResult, currentUserIdResult] = await Promise.all([
    getPostById(postId),
    getCurrentUserId(),
  ]);

  if (postResult.isFailure || currentUserIdResult.isFailure) {
    return null;
  }

  const post = postResult.getValue();
  const currentUserId = currentUserIdResult.getValue();

  const isOwner = post.authorId === currentUserId;

  if (!isOwner) return null;

  return (
    <div className="flex items-center gap-2">
      <EditPostDialog
        post={{
          id: post.id,
          title: post.title,
          body: post.body,
          content: post.content,
          tags: post.tags?.map((tag) => tag.name).join(", ") || "",
        }}
      />
      <DeletePostDialog postId={post.id} postTitle={post.title} />
    </div>
  );
}
