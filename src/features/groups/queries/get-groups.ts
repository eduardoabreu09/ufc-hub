import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { Result } from "@/lib/results";
import { GroupDTO } from "@/types/group";

export async function getGroups(): Promise<Result<GroupDTO[]>> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return Result.failure(userIdResult.error);
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
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: {
          select: { users: true, messages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Result.success(groups);
  } catch (error) {
    return Result.failure("Erro ao buscar os grupos.");
  }
}
