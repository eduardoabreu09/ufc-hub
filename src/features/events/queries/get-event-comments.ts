import "server-only";

import { prisma } from "@/lib/prisma";
import { MessageDTO } from "@/types/message";

export async function getEventCommentsById(
  eventId: number
): Promise<MessageDTO[]> {
  try {
    const messages = await prisma.message.findMany({
      where: {
        eventId: eventId,
      },
      select: {
        id: true,
        body: true,
        createdAt: true,
        senderId: true,
        eventId: true,
        sentBy: {
          select: {
            id: true,
            name: true,
            email: true,
            course: true,
          },
        },
      },
      // INFO: Quick fix to limit max messages;
      // TODO: Add pagination later
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    return messages.reverse() as MessageDTO[];
  } catch (error) {
    return [];
  }
}
