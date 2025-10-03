"use server";

import {
  LoginFormState,
  LoginSchema,
} from "@/features/session/form-schema/login";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function login(
  state: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Senha inválida",
      payload: formData,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log(user);

  if (!user) {
    return {
      message: "Email ou senha incorretos",
      payload: formData,
    };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return {
      message: "Email ou senha incorretos",
      payload: formData,
    };
  }

  await createSession(user.id, user.email);
  redirect("/home");
}
