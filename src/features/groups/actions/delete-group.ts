"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { GroupRole } from "@prisma/client";

export async function deleteGroup(groupId: number) {
  try {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return {
        success: false,
        message: "Você precisa estar logado para deletar um grupo.",
      };
    }

    const userGroup = await prisma.userGroup.findFirst({
      where: {
        groupId: groupId,
        userId: currentUserId,
        role: GroupRole.ADMIN,
      },
    });

    if (!userGroup) {
      return {
        success: false,
        message: "Você não tem permissão para deletar este grupo.",
      };
    }

    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    revalidatePath("/home/group");
    redirect("/home/group");

    return {
      success: true,
      message: "Grupo deletado com sucesso.",
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      success: false,
    };
  }
}
