import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";

export const getCurrentUserId = cache(async () => {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!payload?.user?.id) {
    //TODO: redict to login and clear cookies
    return null;
  }

  return payload.user.id;
});
