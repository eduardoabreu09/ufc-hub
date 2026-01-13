import "server-only";

import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import { BlogPostDTO } from "@/types/blog-post";
import { EventDTO } from "@/types/event";
import { GroupDTO } from "@/types/group";
import { UserDTO } from "@/types/user";
import { Participation } from "@prisma/client";
import { getCurrentUserId } from "@/features/session/queries/get-current-user-id";

export interface UserProfileData {
  user: UserDTO;
  recentPosts: BlogPostDTO[];
  sharedEvents: EventDTO[];
  sharedGroups: GroupDTO[];
}

export async function getUserProfile(
  userId: number
): Promise<Result<UserProfileData>> {
  const viewerResult = await getCurrentUserId();

  if (viewerResult.isFailure) {
    return Result.failure(viewerResult.error ?? "Usuário não autenticado.");
  }

  const viewerId = viewerResult.getValue();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        course: true,
      },
    });

    if (!user) {
      return Result.failure("Usuário não encontrado.");
    }

    const [recentPosts, sharedEvents, sharedGroups] = await Promise.all([
      prisma.blogPost.findMany({
        where: { authorId: userId },
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
            },
          },
        },
        take: 5,
        orderBy: [{ createdAt: "desc" }, { messages: { _count: "desc" } }],
      }),
      prisma.event.findMany({
        where: {
          participations: {
            some: { userId, participation: Participation.YES },
          },
          AND: {
            participations: {
              some: { userId: viewerId, participation: Participation.YES },
            },
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          body: true,
          createdAt: true,
          eventDate: true,
          duration: true,
          location: true,
          imageUrl: true,
          createdBy: {
            select: { id: true, name: true, email: true, course: true },
          },
          creatorId: true,
          tags: {
            select: {
              name: true,
            },
          },
          participations: {
            select: {
              userId: true,
              participation: true,
            },
            where: { userId: viewerId },
          },
          _count: {
            select: {
              participations: { where: { participation: Participation.YES } },
            },
          },
        },
        orderBy: [{ eventDate: "asc" }],
        take: 5,
      }),
      prisma.group.findMany({
        where: {
          users: {
            some: { userId },
          },
          AND: {
            users: {
              some: { userId: viewerId },
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          _count: {
            select: {
              users: true,
              messages: true,
            },
          },
        },
        orderBy: { messages: { _count: "desc" } },
        take: 9,
      }),
    ]);

    return Result.success({
      user,
      recentPosts: recentPosts as BlogPostDTO[],
      sharedEvents: sharedEvents as EventDTO[],
      sharedGroups: sharedGroups as GroupDTO[],
    });
  } catch (error) {
    return Result.failure("Erro ao montar perfil do usuário.");
  }
}
