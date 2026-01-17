import "server-only";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import type { BlogPostDTO } from "@/types/blog-post";
import { cache } from "react";

export const getPostById = cache(
  async (postId: number): Promise<Result<BlogPostDTO>> => {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          body: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              course: true,
            },
          },
          tags: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              messages: true,
              likes: true,
            },
          },
        },
      });

      if (!post) {
        return Result.failure("Postagem não encontrada.");
      }

      return Result.success<BlogPostDTO>(post);
    } catch {
      return Result.failure("Erro ao buscar postagem.");
    }
  },
);
