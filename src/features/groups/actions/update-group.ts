"use server";

import {
  CreateGroupSchema,
  CreateGroupFormState,
} from "@/features/groups/form-schema/create-group";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateGroup(
  groupId: number,
  formData: FormData
): Promise<CreateGroupFormState> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.isFailure) {
    return {
      message: userIdResult.error,
      isSuccess: false,
    };
  }

  const currentUserId = userIdResult.getValue();

  const validatedFields = CreateGroupSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues[0].message,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const { name, description } = validatedFields.data;

    // Check if group exists and user is creator
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true },
    });

    if (!group) {
      return {
        message: "Grupo não encontrado.",
        isSuccess: false,
      };
    }

    if (group.creatorId !== currentUserId) {
      return {
        message:
          "Você não tem permissão para editar este grupo. Apenas o criador pode editar.",
        isSuccess: false,
      };
    }

    await prisma.group.update({
      where: { id: groupId },
      data: {
        name,
        description,
      },
    });

    revalidatePath("/home/group");
    revalidatePath(`/home/group/${groupId}`);

    return {
      message: "Grupo atualizado com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error updating group:", error);
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
