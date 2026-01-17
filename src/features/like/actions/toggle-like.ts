"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";

interface ToggleLikeResult {
  success: boolean;
  like: boolean;
}

export async function toggleLike(
  like: boolean,
  postId?: number,
  eventId?: number,
): Promise<ToggleLikeResult> {
  const userIdResult = await getCurrentUserId();

  if (userIdResult.error && userIdResult.isFailure) {
    return {
      success: false,
      like,
    };
  }

  const userId = userIdResult.getValue();

  try {
    if (like) {
      const existingLike = await prisma.like.findFirst({
        where: {
          userId,
          blogPostId: postId,
          eventId,
        },
      });

      console.log({ existingLike });

      if (!existingLike) {
        await prisma.like.create({
          data: {
            userId,
            blogPostId: postId,
            eventId,
          },
        });
      }
      return {
        success: true,
        like: true,
      }; // liked
    }

    await prisma.like.deleteMany({
      where: { userId, blogPostId: postId, eventId },
    });
    return {
      success: true,
      like: false,
    }; // unliked
  } catch (error) {
    return {
      success: false,
      like,
    };
  }
}
