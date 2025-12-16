import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { Result } from "@/lib/results";
import { EventDTO } from "@/types/event";
import { Participation } from "@prisma/client";

export async function getEvents(): Promise<Result<EventDTO[]>> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return Result.failure(userIdResult.error);
  }

  const currentUserId = userIdResult.getValue();

  try {
    const events = await prisma.event.findMany({
      /*
      TODO: Uncomment to fetch only groups the user is a member of
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      */
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
        participations: {
          where: { userId: currentUserId },
          select: { userId: true, participation: true },
          take: 1,
        },
        tags: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            participations: { where: { participation: Participation.YES } },
          },
        },
      },
      orderBy: { eventDate: "desc" },
    });

    return Result.success(events);
  } catch (error) {
    return Result.failure("Erro ao buscar os grupos.");
  }
}
