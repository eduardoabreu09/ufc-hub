import "server-only";

import { prisma } from "@/lib/prisma";

type EventCacheDTO = {
  id: number;
};

export async function getEventsForCache(): Promise<EventCacheDTO[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        eventDate: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
      },
      take: 50,
      orderBy: { eventDate: "asc" },
    });

    return events as EventCacheDTO[];
  } catch (error) {
    return [];
  }
}
