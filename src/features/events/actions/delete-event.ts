"use server";

import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GeneralFormState } from "@/types/form";

export async function deleteEvent(eventId: number): Promise<GeneralFormState> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.isFailure) {
    return { isSuccess: false, message: userIdResult.error };
  }

  const currentUserId = userIdResult.getValue();

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { creatorId: true },
    });

    if (!event) {
      return {
        isSuccess: false,
        message: "Evento não encontrado.",
      };
    }

    if (event.creatorId !== currentUserId) {
      return {
        isSuccess: false,
        message: "Você não tem permissão para deletar este evento.",
      };
    }

    await prisma.$transaction([
      prisma.eventTag.deleteMany({ where: { eventId } }),
      prisma.eventParticipation.deleteMany({ where: { eventId } }),
      prisma.message.deleteMany({ where: { eventId } }),
      prisma.like.deleteMany({ where: { eventId } }),
      prisma.event.delete({ where: { id: eventId } }),
    ]);

    revalidatePath("/home/event");
    revalidatePath("/home/event/[id]", "page");

    return { isSuccess: true, message: "Evento deletado com sucesso." };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      isSuccess: false,
      message: "Erro inesperado no servidor. Tente novamente.",
    };
  }
}
