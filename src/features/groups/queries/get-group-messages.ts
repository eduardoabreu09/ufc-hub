import "server-only";

import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";
import { MessageDTO } from "@/types/message";

export async function getGroupMessages(groupId: number): Promise<MessageDTO[]> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.isFailure) {
    return [];
  }

  const userId = userIdResult.getValue();

  try {
    const userGroup = await prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId: userId,
          groupId: groupId,
        },
      },
    });

    if (!userGroup) {
      return [];
    }

    const messages = await prisma.message.findMany({
      where: {
        groupId: groupId,
      },
      select: {
        id: true,
        body: true,
        groupId: true,
        createdAt: true,
        senderId: true,
        sentBy: { select: { id: true, name: true, email: true, course: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 100, // Limit to last 100 messages
    });

    return messages.reverse() as MessageDTO[];
  } catch (error) {
    return [];
  }
}
