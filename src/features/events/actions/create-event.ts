"use server";

import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CreateEventFormSchema } from "../form-schema/create-event";

const MAX_TAGS_LIMIT = 10;

export async function createEvent(
  state: CreateEventFormSchema | undefined,
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
    const { title, description, body, eventDate, location, imageUrl, tags } =
      validatedFields.data;

    const eventDateValue = new Date(eventDate);

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

    await prisma.event.create({
      data: {
        title,
        description: description,
        body: body,
        eventDate: eventDateValue,
        location: location,
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

    revalidatePath("/home/event");

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
