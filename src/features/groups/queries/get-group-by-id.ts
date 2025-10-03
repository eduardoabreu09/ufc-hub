import "server-only";

import { prisma } from "@/lib/prisma";
import { Group } from "@/types/group";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { cache } from "react";

export const getGroupById = cache(
  async (groupId: number): Promise<Group | null> => {
    const userId = await getCurrentUserId();

    if (!userId) {
      //TODO: Redirect to login page clear cookies or show a message
      return null;
    }

    try {
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
          /*
          //TODO: Uncomment to restrict access to group members only
          users: {
            some: {
              userId: userId,
            },
          },
          */
        },

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
      });

      return group;
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      return null;
    }
  }
);
