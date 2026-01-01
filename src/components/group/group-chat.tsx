"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, SendIcon } from "lucide-react";
import { sendMessage } from "@/features/groups/actions/send-message";
import { useMessages } from "@/hooks/use-messages";
import { toast } from "sonner";
import { useSession } from "@/context/session-context";
import { formatDateTime } from "@/lib/utils";

interface GroupChatProps {
  groupId: number;
}

export function GroupChat({ groupId }: GroupChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(
    sendMessage.bind(null, groupId),
    undefined
  );
  const { messages, isLoading } = useMessages(groupId);
  const { user } = useSession();

  const previousStateRef = useRef(state);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <Card className="flex flex-col h-full border-0 shadow-none rounded-none">
      <CardContent className="flex-1 flex flex-col min-h-0 p-4">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <p className="flex flex-row">
              <Loader2 className="animate-spin mr-1" />
              Carregando mensagens...
            </p>
          </div>
        )}
        {!isLoading && messages?.length === 0 && (
          <div className="flex justify-center items-center h-full text-center text-muted-foreground ">
            Sem mensagens. Seja o primeiro a interagir!
          </div>
        )}
        {!isLoading && messages && messages?.length > 0 && (
          <ScrollArea className="flex-1 min-h-0 pr-4">
            <div className="space-y-4 p-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.senderId === user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.senderId !== user?.id && (
                      <div className="text-xs font-medium mb-1">
                        {message.sentBy.name}
                      </div>
                    )}
                    <div className="break-words">{message.body}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatDateTime(new Date(message.createdAt), {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

        <div className="flex-shrink-0 mt-4">
          <form action={formAction} className="flex gap-2">
            <Input
              name="content"
              placeholder="Digite sua mensagem..."
              disabled={isPending}
              className="flex-1"
              required
            />
            <Button
              type="submit"
              disabled={isPending}
              aria-label="Enviar mensagem"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
