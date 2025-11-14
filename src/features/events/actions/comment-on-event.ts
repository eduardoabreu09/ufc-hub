"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  SendMessageFormState,
  SendMessageSchema,
} from "@/features/groups/form-schema/send-message";

export async function commentOnEvent(
  eventId: number,
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
    const validatedFields = SendMessageSchema.safeParse({
      content: formData.get("content"),
    });

    if (!validatedFields.success) {
      return {
        message: validatedFields.error.issues[0].message,
        errors: z.flattenError(validatedFields.error).fieldErrors,
        isSuccess: false,
      };
    }

    const { content } = validatedFields.data;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      return {
        message: "Evento não encontrado.",
        isSuccess: false,
      };
    }

    await prisma.message.create({
      data: {
        body: content,
        senderId: currentUserId,
        eventId,
      },
    });

    revalidatePath("/home/event/[id]", "page");

    return {
      message: "Comentário enviado com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error adding event comment:", error);
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
