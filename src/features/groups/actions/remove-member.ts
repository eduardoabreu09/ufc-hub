"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { revalidatePath } from "next/cache";
import { GroupRole } from "@prisma/client";

export async function removeMember(groupId: number, memberUserId: number) {
  try {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return {
        success: false,
        message: "Você precisa estar logado para remover membros.",
      };
    }

    const currentUserGroup = await prisma.userGroup.findFirst({
      where: {
        groupId: groupId,
        userId: currentUserId,
        role: GroupRole.ADMIN,
      },
    });

    if (!currentUserGroup) {
      return {
        success: false,
        message: "Você não tem permissão para remover membros deste grupo.",
      };
    }

    const memberToRemove = await prisma.userGroup.findFirst({
      where: {
        groupId: groupId,
        userId: memberUserId,
      },
    });

    if (!memberToRemove) {
      return {
        success: false,
        message: "Usuário não encontrado no grupo.",
      };
    }

    if (memberUserId === currentUserId) {
      const adminCount = await prisma.userGroup.count({
        where: {
          groupId: groupId,
          role: GroupRole.ADMIN,
        },
      });

      if (adminCount <= 1) {
        return {
          success: false,
          message: "Você não pode se remover sendo o único admin do grupo.",
        };
      }
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
      success: true,
      message: "Membro removido com sucesso.",
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      success: false,
    };
  }
}
