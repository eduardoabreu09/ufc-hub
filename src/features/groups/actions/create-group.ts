"use server";

import {
  CreateGroupSchema,
  CreateGroupFormState,
} from "@/features/groups/form-schema/create-group";
import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { prisma } from "@/lib/prisma";
import { GroupRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createGroup(
  state: CreateGroupFormState | undefined,
  formData: FormData
): Promise<CreateGroupFormState> {
  const userResult = await getCurrentUser();

  if (userResult.isFailure) {
    return {
      message: userResult.error,
      isSuccess: false,
    };
  }

  const currentUser = userResult.getValue();

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

    await prisma.group.create({
      data: {
        name,
        description,
        creatorId: currentUser.id,
        users: {
          create: {
            userId: currentUser.id,
            role: GroupRole.ADMIN,
          },
        },
      },
    });

    revalidatePath("/home/group");

    return {
      message: "Grupo criado com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
