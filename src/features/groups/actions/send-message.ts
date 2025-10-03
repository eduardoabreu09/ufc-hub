"use server";

import {
  SendMessageSchema,
  SendMessageFormState,
} from "@/features/groups/form-schema/send-message";
import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  groupId: number,
  state: SendMessageFormState | undefined,
  formData: FormData
): Promise<SendMessageFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      message: "You must be logged in to send messages",
      success: false,
    };
  }

  // Check if user is a member of the group
  const userGroup = await prisma.userGroup.findUnique({
    where: {
      userId_groupId: {
        userId: currentUser.id,
        groupId: groupId,
      },
    },
  });

  if (!userGroup) {
    return {
      message: "You must be a member of this group to send messages",
      success: false,
    };
  }

  const validatedFields = SendMessageSchema.safeParse({
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid message content",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const { content } = validatedFields.data;

    await prisma.message.create({
      data: {
        body: content,
        senderId: currentUser.id,
        groupId: groupId,
      },
    });

    revalidatePath(`/group/${groupId}`);

    return {
      message: "Message sent successfully",
      success: true,
    };
  } catch (error) {
    console.error("Failed to send message:", error);
    return {
      message: "Failed to send message",
      success: false,
    };
  }
}
