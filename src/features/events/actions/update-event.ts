"use server";

import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { z } from "zod";
import { CreateEventFormSchema } from "../form-schema/create-event";

const MAX_TAGS_LIMIT = 10;
const TAG_LENGTH_LIMIT = 32;

export async function updateEvent(
  eventId: number,
  formData: FormData,
): Promise<CreateEventFormSchema> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.isFailure) {
    return {
      message: userIdResult.error,
      isSuccess: false,
      payload: formData,
    };
  }

  const currentUserId = userIdResult.getValue();

  const validatedFields = CreateEventFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    body: formData.get("body"),
    eventDate: formData.get("eventDate"),
    startTime: formData.get("startTime"),
    duration: formData.get("duration"),
    location: formData.get("location"),
    tags: formData.get("tags"),
    imageUrl: formData.get("imageUrl") || undefined,
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues[0].message,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      isSuccess: false,
      payload: formData,
    };
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { creatorId: true },
    });

    if (!existingEvent) {
      return {
        message: "Evento não encontrado.",
        isSuccess: false,
        payload: formData,
      };
    }

    if (existingEvent.creatorId !== currentUserId) {
      return {
        message: "Você não tem permissão para editar este evento.",
        isSuccess: false,
        payload: formData,
      };
    }

    const {
      title,
      description,
      body,
      eventDate,
      startTime,
      duration,
      location,
      imageUrl,
      tags,
    } = validatedFields.data;

    if (duration <= 0) {
      return {
        message: "A duração do evento deve ser maior que zero.",
        isSuccess: false,
        payload: formData,
      };
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const selectedDate = new Date(eventDate);
    const timezoneOffset = Number(
      formData.get("timezoneOffset") ?? selectedDate.getTimezoneOffset(),
    );

    const eventDateValue = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate(),
        startHour,
        startMinute,
        0,
        0,
      ) +
        timezoneOffset * 60 * 1000,
    );

    if (eventDateValue <= new Date()) {
      return {
        message: "A data e hora do evento devem ser no futuro.",
        isSuccess: false,
        payload: formData,
      };
    }

    const parsedTags = tags
      ?.split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    const uniqueTags = parsedTags
      ? Array.from(new Set(parsedTags)).slice(0, MAX_TAGS_LIMIT)
      : [];

    if (uniqueTags.length > MAX_TAGS_LIMIT) {
      return {
        message: `O número máximo de tags é ${MAX_TAGS_LIMIT}.`,
        isSuccess: false,
        payload: formData,
      };
    }

    if (uniqueTags.length === 0) {
      return {
        message: "Por favor, insira pelo menos uma tag válida para o evento.",
        isSuccess: false,
        payload: formData,
      };
    }

    if (uniqueTags.some((tag) => tag.length > TAG_LENGTH_LIMIT)) {
      return {
        message: `Cada tag deve ter no máximo ${TAG_LENGTH_LIMIT} caracteres.`,
        isSuccess: false,
        payload: formData,
      };
    }

    await prisma.$transaction([
      prisma.eventTag.deleteMany({ where: { eventId } }),
      prisma.event.update({
        where: { id: eventId },
        data: {
          title,
          description,
          body,
          eventDate: eventDateValue,
          duration,
          location,
          imageUrl: imageUrl || null,
          tags:
            uniqueTags.length > 0
              ? {
                  create: uniqueTags.map((name) => ({ name })),
                }
              : undefined,
        },
      }),
    ]);

    updateTag("event-details");
    revalidateTag("event-list", "max");
    revalidatePath("/home/event");

    return {
      message: "Evento atualizado com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
      payload: formData,
    };
  }
}
