"use server";

import {
  CreatePostSchema,
  CreatePostFormState,
} from "@/features/blog/form-schema/create-post";
import { getCurrentUser } from "@/features/session/queries/get-current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MAX_TAGS_LIMIT = 10;
const TAG_LENGTH_LIMIT = 32;

export async function createPost(
  formData: FormData
): Promise<CreatePostFormState> {
  const userResult = await getCurrentUser();

  if (userResult.isFailure) {
    return {
      message: userResult.error,
      isSuccess: false,
    };
  }

  const currentUser = userResult.getValue();

  const validatedFields = CreatePostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    content: formData.get("content"),
    tags: formData.get("tags"),
  });

  if (!validatedFields.success) {
    return {
      message: "Erro de validação. Verifique os campos.",
      errors: z.flattenError(validatedFields.error).fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const { title, body, content, tags } = validatedFields.data;

    const parsedTags = tags
      ?.split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    const uniqueTags = parsedTags ? Array.from(new Set(parsedTags)) : [];

    if (uniqueTags.length === 0) {
      return {
        message: "Por favor, insira pelo menos uma tag válida.",
        isSuccess: false,
      };
    }

    if (uniqueTags.length > MAX_TAGS_LIMIT) {
      return {
        message: `O número máximo de tags é ${MAX_TAGS_LIMIT}.`,
        isSuccess: false,
      };
    }

    if (uniqueTags.some((tag) => tag.length > TAG_LENGTH_LIMIT)) {
      return {
        message: `Cada tag deve ter no máximo ${TAG_LENGTH_LIMIT} caracteres.`,
        isSuccess: false,
      };
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        body,
        content,
        authorId: currentUser.id,
        tags:
          uniqueTags.length > 0
            ? {
                create: uniqueTags
                  .slice(0, MAX_TAGS_LIMIT)
                  .map((name) => ({ name })),
              }
            : undefined,
      },
    });

    revalidatePath("/home/blog");

    return {
      message: "Postagem criada com sucesso.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      message: "Erro inesperado no servidor. Tente novamente.",
      isSuccess: false,
    };
  }
}
