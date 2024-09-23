import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id;

  if (!userId) {
    redirect("/auth/login");
  }

  return {
    isAuth: true,
    userId,
    name: user?.name,
    avartarUrl: user?.image,
    email: user?.email as string,
  };
});
