"use server";

import {
  SignupFormSchema,
  SignUpFormState,
} from "@/features/session/form-schema/signup";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
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
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: z
        .treeifyError(validatedFields.error)
        .errors.map((e) => e)
        .join(", "),
      payload: formData,
    };
  }

  const { name, course, email, password } = validatedFields.data;

  const checkSameEmail = await prisma.user.findFirst({
    where: { email },
  });

  if (checkSameEmail) {
    return {
      errors: { email: ["Email já cadastrado"] },
      payload: formData,
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

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
      payload: formData,
    };
  }

  await createSession(user.id, user.email);
  redirect("/home");
}
