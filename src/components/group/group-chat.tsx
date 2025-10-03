"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon } from "lucide-react";
import { Group, GroupMessage } from "@/types/group";
import { sendMessage } from "@/features/groups/actions/send-message";
import { useMessages } from "@/lib/fetcher";

interface GroupChatProps {
  group: Group;
  currentUserId: number | null;
}

export function GroupChat({ group, currentUserId }: GroupChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(
    sendMessage.bind(null, group.id),
    undefined
  );
  const { messages, isLoading, isError } = useMessages(group.id);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 min-h-0 pr-4">
          <div className="space-y-4 p-1">
            {!messages || messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.senderId === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.senderId !== currentUserId && (
                      <div className="text-xs font-medium mb-1">
                        {message.sentBy.name}
                      </div>
                    )}
                    <div className="break-words">{message.body}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 mt-4">
          {state?.message && !state.success && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-2">
              {state.message}
            </div>
          )}
          <form action={formAction} className="flex gap-2">
            <Input
              name="content"
              placeholder="Type your message..."
              disabled={isPending}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isPending}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
