import "server-only";

import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";
import { MessageDTO } from "@/types/message";
import { Result } from "@/lib/results";

export async function getGroupMessages(
  groupId: number
): Promise<Result<MessageDTO[]>> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return Result.failure(userIdResult.error);
  }

  try {
    /*
    TODO: Uncomment to restrict access to group members only
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
    */

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
      orderBy: { createdAt: "asc" },
      take: 100, // Limit to last 100 messages
    });

    return Result.success(messages);
  } catch (error) {
    return Result.failure("Erro ao buscar as mensagens do grupo.");
  }
}
