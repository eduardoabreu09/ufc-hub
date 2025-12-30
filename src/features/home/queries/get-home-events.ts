import "server-only";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import { EventHomeDTO } from "@/types/event";
import { Participation } from "@prisma/client";

export async function getHomeEvents(): Promise<Result<EventHomeDTO[]>> {
  try {
    const events = await prisma.event.findMany({
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
        _count: {
          select: {
            participations: { where: { participation: Participation.YES } },
          },
        },
      },
      take: 7,
      orderBy: [
        {
          participations: {
            _count: "desc",
          },
        },
        {
          eventDate: "asc",
        },
      ],
    });

    return Result.success(events);
  } catch (error) {
    return Result.failure("Erro ao buscar os grupos.");
  }
}
