"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/features/like/actions/toggle-like";

interface LikeButtonProps {
  id: number;
  type: "blog" | "event";
}

export function LikeButton({ id, type }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [statusRes, countRes] = await Promise.all([
          fetch(`/api/likes/${type}/${id}/status`),
          fetch(`/api/likes/${type}/${id}/count`),
        ]);

        if (statusRes.ok && countRes.ok) {
          const statusData = await statusRes.json();
          const countData = await countRes.json();

          if (isMounted) {
            setLiked(statusData.liked);
            setLikesCount(countData.count);
          }
        }
      } catch (error) {
        console.error("Failed to fetch like data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, type]);

  async function handleToggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked((liked) => !liked);

    startTransition(async () => {
      const result = await toggleLike(
        !previousLiked,
        type === "blog" ? id : undefined,
        type === "event" ? id : undefined,
      );

      if (result.success === false) {
        // Revert on failure
        setLiked(previousLiked);
        setLikesCount(previousCount);
      } else {
        const likedValue = result.like;
        setLiked(likedValue);
        setLikesCount((count) =>
          likedValue ? count + 1 : Math.max(0, count - 1),
        );
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex items-center gap-1.5 px-2 hover:bg-transparent",
        liked
          ? "text-red-500 hover:text-red-600"
          : "text-muted-foreground hover:text-foreground",
      )}
      onClick={handleToggleLike}
      disabled={loading || isPending}
    >
      <Heart
        size={18}
        className={cn(
          "transition-all duration-200",
          liked && "fill-current scale-110",
        )}
      />
      {!loading && <span className="text-sm font-medium">{likesCount}</span>}
    </Button>
  );
}
