import "server-only";

import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";

export async function getGroupMessages(groupId: number) {
  const userId = await getCurrentUserId();

  if (!userId) {
    //TODO: Redirect to login page clear cookies or show a message
    return [];
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
      include: {
        sentBy: {
          select: { id: true, name: true, email: true, course: true },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100, // Limit to last 100 messages
    });

    return messages;
  } catch (error) {
    console.error("Failed to fetch group messages:", error);
    return [];
  }
}
