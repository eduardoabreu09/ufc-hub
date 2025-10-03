"use server";

import {
  AddMemberSchema,
  AddMemberFormState,
} from "@/features/groups/form-schema/add-member";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { GroupRole } from "@prisma/client";

export async function addMember(
  groupId: number,
  state: AddMemberFormState | undefined,
  formData: FormData
): Promise<AddMemberFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      message: "You must be logged in to add members",
      success: false,
    };
  }

  // Check if current user is admin of the group
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
      message: "You must be an admin of this group to add members",
      success: false,
    };
  }

  const validatedFields = AddMemberSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role") || GroupRole.USER,
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const { email, role } = validatedFields.data;

    // Find user by email
    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return {
        message: "User not found",
        success: false,
      };
    }

    // Check if user is already in group
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
        message: "User is already a member of this group",
        success: false,
      };
    }

    // Add user to group
    await prisma.userGroup.create({
      data: {
        userId: userToAdd.id,
        groupId: groupId,
        role: role,
      },
    });

    revalidatePath(`/group/${groupId}`);

    return {
      message: "Member added successfully",
      success: true,
    };
  } catch (error) {
    console.error("Failed to add member:", error);
    return {
      message: "Failed to add member",
      success: false,
    };
  }
}
