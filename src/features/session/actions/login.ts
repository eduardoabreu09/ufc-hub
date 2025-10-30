"use server";

import { LoginSchema } from "@/features/session/form-schema/login";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { GeneralFormState } from "@/types/form";

export async function login(
  state: GeneralFormState | undefined,
  formData: FormData
): Promise<GeneralFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Email ou senha incorretos",
      payload: formData,
      isSuccess: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: "Email ou senha incorretos",
        payload: formData,
        isSuccess: false,
      };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return {
        message: "Email ou senha incorretos",
        payload: formData,
        isSuccess: false,
      };
    }
    await createSession(user.id, user.email);
    return {
      message: "Login realizado com sucesso!",
      payload: formData,
      isSuccess: true,
    };
  } catch (error) {
    return {
      message: "Erro no servidor.",
      payload: formData,
      isSuccess: false,
    };
  }
}
