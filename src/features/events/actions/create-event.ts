"use server";

import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { CreateEventFormSchema } from "../form-schema/create-event";

const MAX_TAGS_LIMIT = 10;
const TAG_LENGTH_LIMIT = 32;

export async function createEvent(
  formData: FormData
): Promise<CreateEventFormSchema> {
  const userResult = await getCurrentUser();

  if (userResult.isFailure) {
    return {
      message: userResult.error,
      isSuccess: false,
      payload: formData,
    };
  }

  const currentUser = userResult.getValue();

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

    const splitedStartTime = startTime.split(":");
    const eventDateValue = new Date(eventDate);
    eventDateValue.setHours(Number(splitedStartTime[0]));
    eventDateValue.setMinutes(Number(splitedStartTime[1]));

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

    const event = await prisma.event.create({
      data: {
        title,
        description: description,
        body: body,
        eventDate: eventDateValue,
        location: location,
        duration: duration,
        creatorId: currentUser.id,
        imageUrl: imageUrl || null,
        tags:
          uniqueTags.length > 0
            ? {
                create: uniqueTags.map((name) => ({ name })),
              }
            : undefined,
      },
    });

    revalidateTag("event-list", "max");
    revalidatePath("/home/event");
    revalidatePath(`/home/event/${event.id}`);

    return {
      message: "Evento criado com sucesso!",
      isSuccess: true,
    };
  } catch (error) {
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
      payload: formData,
    };
  }
}
