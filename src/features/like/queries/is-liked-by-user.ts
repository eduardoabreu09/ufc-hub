import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";

export async function isLikedByUser(
  postId?: number,
  eventId?: number,
): Promise<boolean> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return false;
  }

  const userId = userIdResult.getValue();

  try {
    const liked = await prisma.like.count({
      where: { userId, blogPostId: postId, eventId },
    });

    return liked > 0;
  } catch (error) {
    console.error("Error fetching like by user:", error);
    return false;
  }
}
