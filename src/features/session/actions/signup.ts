"use server";

import {
  SignupFormSchema,
  SignUpFormState,
} from "@/features/session/form-schema/signup";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcrypt";
import z from "zod";

export async function signup(
  state: SignUpFormState | undefined,
  formData: FormData
): Promise<SignUpFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    course: formData.get("course"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues[0].message,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      payload: formData,
      isSuccess: false,
    };
  }

  const { name, course, email, password } = validatedFields.data;

  try {
    const checkSameEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (checkSameEmail) {
      return {
        errors: { email: ["Email já cadastrado"] },
        payload: formData,
        isSuccess: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        course,
        email,
        password: hashedPassword,
      },
    });

    await createSession(user.id, user.email);
    return {
      message: "Cadastro realizado com sucesso!",
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
