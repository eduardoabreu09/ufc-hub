import "server-only";

import { prisma } from "@/lib/prisma";

export async function getEventLikes(eventId: number): Promise<number> {
  try {
    const count = await prisma.like.count({
      where: { eventId },
    });
    return count;
  } catch (error) {
    console.error("Error fetching event likes:", error);
    return 0;
  }
}
