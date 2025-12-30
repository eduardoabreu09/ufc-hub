"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { revalidatePath, updateTag } from "next/cache";
import { GeneralFormState } from "@/types/form";
import { Participation } from "@prisma/client";

export async function participateInEvent(
  eventId: number,
  participationType: Participation
): Promise<GeneralFormState> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return { isSuccess: false, message: userIdResult.error };
  }

  const currentUserId = userIdResult.getValue();

  try {
    await prisma.eventParticipation.upsert({
      where: {
        userId_eventId: {
          userId: currentUserId,
          eventId: eventId,
        },
      },
      update: {
        participation: participationType,
      },
      create: {
        userId: currentUserId,
        eventId: eventId,
        participation: participationType,
      },
    });

    revalidatePath("/home/event");

    return { isSuccess: true, message: "Participação confirmada" };
  } catch (error) {
    console.error("Error participating in event:", error);
    return {
      isSuccess: false,
      message: "Erro inesperado no servidor. Tente novamente.",
    };
  }
}
