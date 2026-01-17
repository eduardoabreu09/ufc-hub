import "server-only";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import { BlogPostDTO } from "@/types/blog-post";
import { parseWithFallback } from "@/lib/utils";

export async function getPosts(
  query?: string,
  pageString?: string,
): Promise<Result<BlogPostDTO[]>> {
  const page = Math.max(parseWithFallback(pageString ?? "", 1), 1);
  const take = 10;
  const skip = (page - 1) * take;
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
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
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    return Result.success(posts as BlogPostDTO[]);
  } catch {
    return Result.failure("Erro ao buscar postagens.");
  }
}
