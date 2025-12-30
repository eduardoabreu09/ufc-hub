import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { Result } from "@/lib/results";
import { EventDTO } from "@/types/event";
import { Participation } from "@prisma/client";
import { parseWithFallback } from "@/lib/utils";

export async function getEvents(
  query?: string,
  pageString?: string
): Promise<Result<EventDTO[]>> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return Result.failure(userIdResult.error);
  }

  const currentUserId = userIdResult.getValue();

  const page = Math.max(parseWithFallback(pageString ?? "", 1), 1);
  const take = 10;
  const skip = (page - 1) * take;

  try {
    const events = await prisma.event.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
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
      skip,
      take,
      orderBy: { eventDate: "desc" },
    });

    return Result.success(events);
  } catch (error) {
    return Result.failure("Erro ao buscar os grupos.");
  }
}
