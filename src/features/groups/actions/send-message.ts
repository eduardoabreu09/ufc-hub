"use server";

import {
  SendMessageSchema,
  SendMessageFormState,
} from "@/features/groups/form-schema/send-message";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function sendMessage(
  groupId: number,
  state: SendMessageFormState | undefined,
  formData: FormData
): Promise<SendMessageFormState> {
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
      select: { userId: true },
    });

    if (!userGroup) {
      return {
        message: "Você precisa ser membro deste grupo para enviar mensagens.",
        isSuccess: false,
      };
    }

    const validatedFields = SendMessageSchema.safeParse({
      content: formData.get("content"),
    });

    if (!validatedFields.success) {
      return {
        message: z
          .treeifyError(validatedFields.error)
          .errors.map((e) => e)
          .join(", "),
        errors: z.flattenError(validatedFields.error).fieldErrors,
        isSuccess: false,
      };
    }

    const { content } = validatedFields.data;

    await prisma.message.create({
      data: {
        body: content,
        senderId: currentUserId,
        groupId: groupId,
      },
    });

    revalidatePath("/home/group/[id]", "page");

    return {
      message: "Mensagem enviada com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
