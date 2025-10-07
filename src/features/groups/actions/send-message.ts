"use server";

import {
  SendMessageSchema,
  SendMessageFormState,
} from "@/features/groups/form-schema/send-message";
import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function sendMessage(
  groupId: number,
  state: SendMessageFormState | undefined,
  formData: FormData
): Promise<SendMessageFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      message: "Você precisa estar logado para enviar mensagens.",
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

  if (!userGroup) {
    return {
      message: "Você precisa ser membro deste grupo para enviar mensagens.",
      success: false,
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

    revalidatePath(`/home/group/${groupId}`);

    return {
      message: "Mensagem enviada com sucesso.",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      success: false,
    };
  }
}
