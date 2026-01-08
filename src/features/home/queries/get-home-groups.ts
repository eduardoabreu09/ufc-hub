import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { Result } from "@/lib/results";
import { GroupDTO } from "@/types/group";

export async function getHomeGroups(): Promise<Result<GroupDTO[]>> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return Result.failure(userIdResult.error);
  }

  const userId = userIdResult.getValue();

  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const groups = await prisma.group.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            messages: {
              where: {
                createdAt: {
                  gte: today,
                },
                senderId: {
                  not: userId,
                },
              },
            },
          },
        },
      },
      take: 9,
      orderBy: [{ messages: { _count: "desc" } }, { createdAt: "desc" }],
    });

    return Result.success(groups);
  } catch (error) {
    return Result.failure("Erro ao buscar os grupos.");
  }
}
