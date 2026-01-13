"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentOnPost } from "@/features/blog/actions/comment-on-post";
import type { MessageDTO } from "@/types/message";
import { Loader2, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";
import { commentOnEvent } from "@/features/events/actions/comment-on-event";
import AvatarName from "./avatar-name";
import Link from "next/link";

interface CommentSectionProps {
  id: number;
  showInput?: boolean;
  type: "event" | "blog";
  comments: MessageDTO[];
}

export function CommentSection({
  id,
  showInput,
  type,
  comments,
}: CommentSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const commentOnCurrent =
    type === "blog"
      ? commentOnPost.bind(null, id)
      : commentOnEvent.bind(null, id);
  const [state, formAction, isPending] = useActionState(
    commentOnCurrent,
    undefined
  );

  const previousStateRef = useRef(state);

  useEffect(() => {
    if (
      !state?.isSuccess &&
      state !== previousStateRef.current &&
      state?.message
    ) {
      toast.error(state.message);
    }
    previousStateRef.current = state;
  }, [state]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">
          Comentários ({comments.length})
        </h2>
      </header>

      <div className="space-y-6">
        {comments.length === 0 && (
          <p className="text-sm italic text-muted-foreground">
            Nenhum comentário ainda.
          </p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <AvatarName name={comment.sentBy.name} className="h-10 w-10" />

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <Link
                  className="flex flex-wrap items-center gap-2"
                  href={`/home/profile/${comment.senderId}`}
                >
                  <span className="font-semibold">{comment.sentBy.name}</span>
                  <span className="text-muted-foreground">
                    {formatDateTime(comment.createdAt, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {comment.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showInput && (
        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-3 md:flex-row md:items-start"
        >
          <div className="flex-1">
            <Textarea
              name="content"
              placeholder="Escreva um comentário..."
              className="min-h-[96px]"
              required
            />
            {state?.errors?.content && (
              <p className="mt-1 text-sm text-destructive">
                {state.errors.content[0]}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <SendIcon className="mr-2 h-4 w-4" />
                Enviar
              </>
            )}
          </Button>
        </form>
      )}
    </section>
  );
}
