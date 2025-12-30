import "server-only";

import { prisma } from "@/lib/prisma";

type EventCacheDTO = {
  id: number;
};

export async function getEventsForCache(): Promise<EventCacheDTO[]> {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
      },
      take: 50,
      orderBy: { eventDate: "desc" },
    });

    return events as EventCacheDTO[];
  } catch (error) {
    return [];
  }
}
