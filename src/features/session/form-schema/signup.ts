import { GeneralFormState } from "@/types/form";
import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Nome precisa ter no mínimo 3 caracteres." }),
  course: z.string().trim(),
  email: z.email({ error: "Email inválido." }).trim(),
  password: z
    .string()
    .trim()
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres." }),
  /* TODO: Ajust regex to be more strict
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
  */
});

export interface SignUpFormState extends GeneralFormState {
  errors?: {
    name?: string[];
    course?: string[];
    email?: string[];
    password?: string[];
  };
}
