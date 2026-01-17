import "server-only";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import { BlogPostDTO } from "@/types/blog-post";

export async function getHomePosts(): Promise<Result<BlogPostDTO[]>> {
  try {
    const posts = await prisma.blogPost.findMany({
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
      take: 5,
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          messages: {
            _count: "desc",
          },
        },
      ],
    });

    return Result.success(posts as BlogPostDTO[]);
  } catch {
    return Result.failure("Erro ao buscar postagens.");
  }
}
