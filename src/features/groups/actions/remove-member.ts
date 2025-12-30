"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { revalidatePath } from "next/cache";
import { GroupRole } from "@prisma/client";
import { GeneralFormState } from "@/types/form";

export async function removeMember(
  groupId: number,
  memberUserId: number
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
    const currentUserGroup = await prisma.userGroup.findFirst({
      where: {
        groupId: groupId,
        userId: currentUserId,
        role: GroupRole.ADMIN,
      },
      select: { userId: true },
    });

    if (!currentUserGroup) {
      return {
        message: "Você não tem permissão para remover membros deste grupo.",
        isSuccess: false,
      };
    }

    const memberToRemove = await prisma.userGroup.findFirst({
      where: {
        groupId: groupId,
        userId: memberUserId,
      },
      select: {
        userId: true,
        role: true,
        group: { select: { creatorId: true } },
      },
    });

    if (!memberToRemove) {
      return {
        message: "Usuário não encontrado no grupo.",
        isSuccess: false,
      };
    }

    if (memberUserId === memberToRemove.group.creatorId) {
      return {
        message: "Você não pode remover o criador do grupo.",
        isSuccess: false,
      };
    }

    await prisma.userGroup.delete({
      where: {
        userId_groupId: {
          userId: memberUserId,
          groupId: groupId,
        },
      },
    });

    revalidatePath(`/home/group/${groupId}`);

    return {
      message: "Membro removido com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
