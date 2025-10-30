import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Email inválido." }).trim(),
  password: z
    .string()
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres." })
    /* TODO: Ajust regex to be more strict
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    */
    .trim(),
});
