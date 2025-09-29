import { z } from "zod";

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Usuário precisa ter no mínimo 3 caracteres." })
    .trim(),
  name: z
    .string()
    .min(3, { message: "Nome precisa ter no mínimo 3 caracteres." })
    .trim(),
  course: z
    .string()
    .min(3, { message: "Curso precisa ter no mínimo 3 caracteres." })
    .trim(),
  email: z.email({ error: "Email inválido." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        username?: { errors: string[] };
        name?: { errors: string[] };
        course?: { errors: string[] };
        email?: { errors: string[] };
        password?: { errors: string[] };
      };
      message?: string;
      payload?: FormData;
    }
  | undefined;
