import "server-only";

import { prisma } from "@/lib/prisma";

type BlogPostCacheDTO = {
  id: number;
};

export async function getPostsForCache(): Promise<BlogPostCacheDTO[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
      },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    return posts as BlogPostCacheDTO[];
  } catch {
    return [];
  }
}
