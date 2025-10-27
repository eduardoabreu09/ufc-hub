import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { UserDTO } from "@/types/user";
import { Result } from "@/lib/results";

export const getCurrentUser = cache(async (): Promise<Result<UserDTO>> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.user) {
    return Result.failure("Usuário não autenticado.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, course: true },
    });

    if (!user) {
      //TODO: redict to login and clear cookies
      return Result.failure("Usuário não encontrado.");
    }
    return Result.success(user);
  } catch (error) {
    return Result.failure("Erro no servidor.");
  }
});
