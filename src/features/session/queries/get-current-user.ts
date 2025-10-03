import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!payload?.user?.id) {
    //TODO: redict to login and clear cookies
    return null;
  }

  const user = prisma.user.findUnique({
    where: { id: payload.user.id },
    select: { id: true, name: true, email: true, course: true },
  });

  if (!user) {
    //TODO: redict to login and clear cookies
    return null;
  }

  return user;
});
