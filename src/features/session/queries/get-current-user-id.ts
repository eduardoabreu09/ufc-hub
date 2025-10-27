import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";
import { Result } from "@/lib/results";

export const getCurrentUserId = cache(async (): Promise<Result<number>> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.user) {
    return Result.failure("Usuário não autenticado.");
  }

  return Result.success(session.user.id);
});
