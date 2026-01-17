import "server-only";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import { EventDetailsDTO } from "@/types/event";
import { cache } from "react";

export const getEventById = cache(
  async (eventId: number): Promise<Result<EventDetailsDTO>> => {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
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
        },
      });

      if (!event) {
        return Result.failure("Evento não encontrado.");
      }

      return Result.success(event);
    } catch (error) {
      return Result.failure("Erro ao buscar o evento.");
    }
  },
);
