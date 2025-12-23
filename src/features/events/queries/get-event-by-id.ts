import "server-only";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import { EventDetailsDTO } from "@/types/event";

export async function getEventById(
  eventId: number
): Promise<Result<EventDetailsDTO>> {
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
            createdAt: true,
            participation: true,
            user: {
              select: { id: true, name: true, email: true, course: true },
            },
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
}
