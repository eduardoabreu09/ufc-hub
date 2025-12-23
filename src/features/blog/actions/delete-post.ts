"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";
import { revalidatePath } from "next/cache";
import { GeneralFormState } from "@/types/form";

export async function deletePost(postId: number): Promise<GeneralFormState> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.isFailure) {
    return { isSuccess: false, message: userIdResult.error };
  }

  const currentUserId = userIdResult.getValue();

  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      return {
        isSuccess: false,
        message: "Postagem não encontrada.",
      };
    }

    if (post.authorId !== currentUserId) {
      return {
        isSuccess: false,
        message: "Você não tem permissão para deletar esta postagem.",
      };
    }

    await prisma.$transaction([
      prisma.blogTag.deleteMany({ where: { blogId: postId } }),
      prisma.like.deleteMany({ where: { blogPostId: postId } }),
      prisma.blogPost.delete({
        where: {
          id: postId,
        },
      }),
    ]);

    revalidatePath("/home/blog");
    revalidatePath(`/home/blog/${postId}`);

    return { isSuccess: true, message: "Postagem deletada com sucesso." };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      isSuccess: false,
      message: "Erro inesperado no servidor. Tente novamente.",
    };
  }
}
