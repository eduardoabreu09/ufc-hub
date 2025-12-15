import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { cache } from "react";
import { GroupMessagesDTO } from "@/types/group";
import { Result } from "@/lib/results";

export const getGroupById = cache(
  async (groupId: number): Promise<Result<GroupMessagesDTO>> => {
    const userIdResult = await getCurrentUserId();

    if (userIdResult.error && userIdResult.isFailure) {
      return Result.failure(userIdResult.error);
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
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          creatorId: true,
          createdBy: {
            select: { id: true, name: true, email: true, course: true },
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

      const currentUserId = userIdResult.getValue();

      group?.users.sort((a, b) => {
        const weight = (member: (typeof group.users)[number]) => {
          if (member.userId === currentUserId) return 0; // current user always on top
          if (member.role === "ADMIN") return 1; // admins next
          return 2; // regular users last
        };

        const weightDiff = weight(a) - weight(b);
        if (weightDiff !== 0) return weightDiff;

        return a.user.name.localeCompare(b.user.name);
      });

      if (!group) {
        return Result.failure("Grupo não encontrado.");
      }

      return Result.success(group);
    } catch (error) {
      return Result.failure("Erro ao buscar o grupo.");
    }
  }
);
