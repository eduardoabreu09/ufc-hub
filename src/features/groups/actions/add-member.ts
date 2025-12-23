"use server";

import {
  AddMemberSchema,
  AddMemberFormState,
} from "@/features/groups/form-schema/add-member";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GroupRole } from "@prisma/client";
import { z } from "zod";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";

export async function addMember(
  groupId: number,
  formData: FormData
): Promise<AddMemberFormState> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.isFailure) {
    return {
      message: userIdResult.error,
      isSuccess: false,
    };
  }

  const currentUserId = userIdResult.getValue();

  try {
    const userGroup = await prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId: currentUserId,
          groupId: groupId,
        },
      },
      select: { role: true },
    });

    if (!userGroup || userGroup.role !== GroupRole.ADMIN) {
      return {
        message: "Você não tem permissão para adicionar membros a este grupo.",
        isSuccess: false,
      };
    }

    const validatedFields = AddMemberSchema.safeParse({
      email: formData.get("email"),
      role: formData.get("role") || GroupRole.USER,
    });

    if (!validatedFields.success) {
      return {
        message: validatedFields.error.issues[0].message,
        errors: z.flattenError(validatedFields.error).fieldErrors,
        isSuccess: false,
      };
    }

    const { email, role } = validatedFields.data;

    const userToAdd = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!userToAdd) {
      return {
        message: "Email não encontrado.",
        isSuccess: false,
      };
    }

    const existingMember = await prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId: userToAdd.id,
          groupId: groupId,
        },
      },
    });

    if (existingMember) {
      return {
        message: "Usuário já é membro do grupo.",
        isSuccess: false,
      };
    }

    await prisma.userGroup.create({
      data: {
        userId: userToAdd.id,
        groupId: groupId,
        role: role,
      },
    });

    revalidatePath(`/home/group/${groupId}`);

    return {
      message: "Membro adicionado com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
