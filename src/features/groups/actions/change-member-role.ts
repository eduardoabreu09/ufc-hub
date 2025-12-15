"use server";

import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";
import { GeneralFormState } from "@/types/form";
import { GroupRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function changeMemberRole(
  groupId: number,
  targetUserId: number,
  newRole: GroupRole
): Promise<GeneralFormState> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.isFailure) {
    return {
      message: userIdResult.error,
      isSuccess: false,
    };
  }

  const currentUserId = userIdResult.getValue();

  try {
    // 1. Check if current user is ADMIN of the group
    const currentUserGroup = await prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId: currentUserId,
          groupId: groupId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!currentUserGroup || currentUserGroup.role !== GroupRole.ADMIN) {
      return {
        message: "Você não tem permissão para alterar papéis neste grupo.",
        isSuccess: false,
      };
    }

    // 2. Check if target user is the CREATOR of the group
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        creatorId: true,
      },
    });

    if (!group) {
      return {
        message: "Grupo não encontrado.",
        isSuccess: false,
      };
    }

    if (group.creatorId === targetUserId) {
      return {
        message: "Não é possível alterar o papel do criador do grupo.",
        isSuccess: false,
      };
    }

    // 3. Update the role
    await prisma.userGroup.update({
      where: {
        userId_groupId: {
          userId: targetUserId,
          groupId: groupId,
        },
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath(`/home/group/${groupId}`);

    return {
      message: "Papel do membro atualizado com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error changing member role:", error);
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
