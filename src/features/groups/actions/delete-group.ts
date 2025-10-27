"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { revalidatePath } from "next/cache";
import { GeneralFormState } from "@/types/form";

export async function deleteGroup(groupId: number): Promise<GeneralFormState> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return { isSuccess: false, message: userIdResult.error };
  }

  const currentUserId = userIdResult.getValue();

  try {
    const userGroup = await prisma.userGroup.findFirst({
      where: {
        groupId: groupId,
        userId: currentUserId,
        AND: {
          group: {
            creatorId: currentUserId,
          },
        },
      },
      select: {
        userId: true,
      },
    });

    if (!userGroup) {
      return {
        isSuccess: false,
        message: "Você não tem permissão para deletar este grupo.",
      };
    }

    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    revalidatePath("/home/group");
    return { isSuccess: true, message: "Grupo deletado com sucesso." };
  } catch (error) {
    console.error("Error deleting group:", error);
    return {
      isSuccess: false,
      message: "Erro inesperado no servidor. Tente novamente.",
    };
  }
}
