import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import type { BlogPostDTO } from "@/types/blog-post";
import { CalendarDays, MessageSquareIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

interface PostCardProps {
  post: BlogPostDTO;
}

export function PostCard({ post }: PostCardProps) {
  const commentCount = post._count?.messages ?? 0;

  return (
    <Card className="h-full w-full sm:max-w-2xl lg:max-w-3xl hover:bg-muted/50 transition-colors cursor-pointer flex flex-col">
      <Link href={`/home/blog/${post.id}`}>
        <CardHeader>
          <div className="mb-4">
            <div className="flex flex-wrap gap-3 text-xs tracking-wider text-muted-foreground uppercase md:gap-5 lg:gap-6">
              {post.tags &&
                post.tags.map((tag) => (
                  <Badge key={tag.name}>{tag.name}</Badge>
                ))}
            </div>
          </div>
          <div className="flex gap-1 items-center text-sm text-muted-foreground mb-2 md:text-base">
            <CalendarDays size={16} />
            <span>
              {formatDateTime(post.createdAt, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h2 className="mb-4 text-xl font-semibold md:text-2xl lg:text-3xl">
            {post.title}
          </h2>
          <p className="mb-4 text-muted-foreground">{post.body}</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <UserIcon size={16} />
              {post.author.name}
            </span>
            {post.author.course && (
              <>
                <span>•</span>
                <span>{post.author.course}</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <MessageSquareIcon size={16} />
            <span>{commentCount} comentários</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
