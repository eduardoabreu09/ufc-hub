"use server";

import {
  AddMemberSchema,
  AddMemberFormState,
} from "@/features/groups/form-schema/add-member";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { GroupRole } from "@prisma/client";
import { z } from "zod";

export async function addMember(
  groupId: number,
  state: AddMemberFormState | undefined,
  formData: FormData
): Promise<AddMemberFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      message: "Você precisa estar logado para adicionar membros.",
      success: false,
    };
  }

  const userGroup = await prisma.userGroup.findUnique({
    where: {
      userId_groupId: {
        userId: currentUser.id,
        groupId: groupId,
      },
    },
  });

  if (!userGroup || userGroup.role !== GroupRole.ADMIN) {
    return {
      message: "Você não tem permissão para adicionar membros a este grupo.",
      success: false,
    };
  }

  const validatedFields = AddMemberSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role") || GroupRole.USER,
  });

  if (!validatedFields.success) {
    return {
      message: z
        .treeifyError(validatedFields.error)
        .errors.map((e) => e)
        .join(", "),
      errors: z.flattenError(validatedFields.error).fieldErrors,
      success: false,
    };
  }

  try {
    const { email, role } = validatedFields.data;

    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return {
        message: "Email não encontrado.",
        success: false,
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
        success: false,
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
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      success: false,
    };
  }
}
