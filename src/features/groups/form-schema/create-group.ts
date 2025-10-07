import { z } from "zod";

export const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nome do groupo é obrigatório." })
    .max(100, { message: "Nome do grupo deve ter no máximo 100 caracteres." })
    .trim(),
  description: z.string().trim().optional(),
});

export type CreateGroupFormState = {
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
  };
  success?: boolean;
};
