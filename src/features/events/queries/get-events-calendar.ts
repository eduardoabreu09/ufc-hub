import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { Result } from "@/lib/results";
import { EventCalendarDTO } from "@/types/event";
import { Participation } from "@prisma/client";

export async function getEventsForCalendar(): Promise<
  Result<EventCalendarDTO[]>
> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return Result.failure(userIdResult.error);
  }

  const currentUserId = userIdResult.getValue();

  try {
    const events = await prisma.event.findMany({
      where: {
        participations: {
          some: { userId: currentUserId },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        eventDate: true,
        location: true,
        duration: true,
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
          where: { userId: currentUserId },
          select: { userId: true, participation: true },
          take: 1,
        },
        _count: {
          select: {
            participations: { where: { participation: Participation.YES } },
          },
        },
      },
      orderBy: { eventDate: "asc" },
    });

    return Result.success(events);
  } catch (error) {
    return Result.failure("Erro ao buscar os eventos do calendário.");
  }
}
