"use client";
import { useSession } from "@/context/session-context";
import { EditPostDialog } from "./blog-dialog";
import { DeletePostDialog } from "./delete-post-dialog";
import { BlogPostDTO } from "@/types/blog-post";

export default function BlogAuthorActions({ post }: { post: BlogPostDTO }) {
  const { user } = useSession();
  const isOwner = post.authorId === user?.id;

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
