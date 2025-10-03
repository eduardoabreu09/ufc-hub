import "server-only";

import { prisma } from "@/lib/prisma";
import { Group } from "@/types/group";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";

export async function getGroups(): Promise<Group[]> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  try {
    const groups = await prisma.group.findMany({
      /*
      TODO: Uncomment to fetch only groups the user is a member of
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      */
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        users: {
          include: {
            user: {
              select: { id: true, name: true, email: true, course: true },
            },
          },
        },
        _count: {
          select: { users: true, messages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return groups;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return [];
  }
}
