import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { cache } from "react";
import { Result } from "@/lib/results";
import { EventMessageDTO } from "@/types/event";

export const getEventById = cache(
  async (eventId: number): Promise<Result<EventMessageDTO>> => {
    const userIdResult = await getCurrentUserId();

    if (userIdResult.error && userIdResult.isFailure) {
      return Result.failure(userIdResult.error);
    }

    try {
      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
          /*
          // TODO: Uncomment to restrict access to group members only
          users: {
            some: {
              userId: userId,
            },
          },
          */
        },
        select: {
          id: true,
          title: true,
          description: true,
          body: true,
          createdAt: true,
          eventDate: true,
          location: true,
          duration: true,
          imageUrl: true,
          createdBy: {
            select: { id: true, name: true, email: true, course: true },
          },
          creatorId: true,
          tags: {
            select: {
              name: true,
            },
          },
          participations: {
            select: {
              userId: true,
              eventId: true,
              createdAt: true,
              participation: true,
              user: {
                select: { id: true, name: true, email: true, course: true },
              },
            },
          },
          messages: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              senderId: true,
              eventId: true,
              sentBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  course: true,
                },
              },
            },
            // INFO: Quick fix to limit max messages;
            // TODO: Add pagination later
            take: 100,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!event) {
        return Result.failure("Evento não encontrado.");
      }

      return Result.success(event);
    } catch (error) {
      return Result.failure("Erro ao buscar o evento.");
    }
  }
);
