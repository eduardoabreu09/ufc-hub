import "server-only";

import { prisma } from "@/lib/prisma";
import { EventParticipationDTO } from "@/types/event";

export async function getEventParticipations(
  eventId: number
): Promise<EventParticipationDTO[]> {
  try {
    const participations = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
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

    if (!participations) {
      return [];
    }

    return participations.participations as EventParticipationDTO[];
  } catch (error) {
    return [];
  }
}
