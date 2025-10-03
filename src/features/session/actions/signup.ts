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
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    course: formData.get("course"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: z
        .treeifyError(validatedFields.error)
        .errors.map((e) => e)
        .join(", "),
      payload: formData,
    };
  }

  // 2. Prepare data for insertion into database
  const { name, course, email, password } = validatedFields.data;

  const checkSameEmail = await prisma.user.findFirst({
    where: { email },
  });

  if (checkSameEmail) {
    return {
      errors: { email: { errors: ["Email já cadastrado"] } },
      payload: formData,
    };
  }

  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
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
