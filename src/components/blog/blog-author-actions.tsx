"use client";

import { useSession } from "@/context/session-context";
import { BlogPostWithMessagesDTO } from "@/types/blog-post";
import { EditPostDialog } from "./blog-dialog";
import { DeletePostDialog } from "./delete-post-dialog";

interface BlogProps {
  post: BlogPostWithMessagesDTO;
}

export function BlogAuthorActions({ post }: BlogProps) {
  const { user } = useSession();

  if (!user) return null;

  const isOwner = post.authorId === user.id;

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
