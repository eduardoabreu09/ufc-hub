import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import type { BlogPostWithMessagesDTO } from "@/types/blog-post";

export const getPostById = cache(
  async (postId: number): Promise<Result<BlogPostWithMessagesDTO>> => {
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
          messages: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              senderId: true,
              eventId: true,
              sentBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  course: true,
                },
              },
            },
            // INFO: Quick fix to limit max messages;
            // TODO: Add pagination later
            take: 100,
            orderBy: { createdAt: "asc" },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      });

      if (!post) {
        return Result.failure("Postagem não encontrada.");
      }

      return Result.success<BlogPostWithMessagesDTO>(post);
    } catch {
      return Result.failure("Erro ao buscar postagem.");
    }
  }
);
