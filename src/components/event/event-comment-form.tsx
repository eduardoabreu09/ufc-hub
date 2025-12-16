"use client";

import { useActionState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { commentOnEvent } from "@/features/events/actions/comment-on-event";
import { toast } from "sonner";

interface EventCommentFormProps {
  eventId: number;
}

export function EventCommentForm({ eventId }: EventCommentFormProps) {
  const [state, formAction, isPending] = useActionState(
    commentOnEvent.bind(null, eventId),
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const previousStateRef = useRef(state);

  useEffect(() => {
    if (state === previousStateRef.current || !state) {
      return;
    }

    if (state.isSuccess) {
      formRef.current?.reset();
      if (state.message) {
        toast.success(state.message);
      }
    } else if (state.message) {
      toast.error(state.message);
    }

    previousStateRef.current = state;
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <Textarea
        name="content"
        placeholder="Compartilhe um comentário sobre este evento"
        disabled={isPending}
        required
        minLength={1}
        maxLength={1000}
        aria-invalid={state?.errors?.content ? "true" : undefined}
      />
      {state?.errors?.content && (
        <p className="text-sm text-destructive">{state.errors.content[0]}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enviando..." : "Comentar"}
        </Button>
      </div>
    </form>
  );
}
