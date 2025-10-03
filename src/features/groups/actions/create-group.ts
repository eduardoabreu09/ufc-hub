"use server";

import {
  CreateGroupSchema,
  CreateGroupFormState,
} from "@/features/groups/form-schema/create-group";
import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { prisma } from "@/lib/prisma";
import { GroupRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createGroup(
  state: CreateGroupFormState | undefined,
  formData: FormData
): Promise<CreateGroupFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      message: "You must be logged in to create a group",
      success: false,
    };
  }

  const validatedFields = CreateGroupSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
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

    revalidatePath("/group");

    return {
      message: "Group created successfully",
      success: true,
    };
  } catch (error) {
    console.error("Failed to create group:", error);
    return {
      message: "Failed to create group",
      success: false,
    };
  }
}
