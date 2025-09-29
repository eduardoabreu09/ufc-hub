"use server";

import { FormState, SignupFormSchema } from "@/form-schema/signup";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    name: formData.get("name"),
    course: formData.get("course"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log(z.treeifyError(validatedFields.error));
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: z
        .treeifyError(validatedFields.error)
        .errors.map((e) => e)
        .join(", "),
      payload: formData,
    } as FormState;
  }

  // 2. Prepare data for insertion into database
  const { username, name, course, email, password } = validatedFields.data;

  const checkSameUsername = await prisma.user.findFirst({
    where: { username },
  });

  if (checkSameUsername) {
    return {
      errors: { username: { errors: ["Usuário já existe"] } },
      payload: formData,
    } as FormState;
  }

  const checkSameEmail = await prisma.user.findFirst({
    where: { email },
  });

  if (checkSameEmail) {
    return {
      errors: { email: { errors: ["Email já cadastrado"] } },
      payload: formData,
    } as FormState;
  }

  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
  const user = await prisma.user.create({
    data: {
      id: undefined,
      username,
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
    } as FormState;
  }

  await createSession(user.id);
  // 5. Redirect user
  redirect("/profile");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
