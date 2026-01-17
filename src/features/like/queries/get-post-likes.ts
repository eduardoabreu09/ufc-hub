import "server-only";

import { prisma } from "@/lib/prisma";

export async function getPostLikes(postId: number): Promise<number> {
  try {
    const count = await prisma.like.count({
      where: { blogPostId: postId },
    });
    console.log({ count });
    return count;
  } catch (error) {
    console.error("Error fetching post likes:", error);
    return 0;
  }
}
