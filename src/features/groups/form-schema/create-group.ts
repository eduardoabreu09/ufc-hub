import { GeneralFormState } from "@/types/form";
import { z } from "zod";

export const CreateGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Nome do grupo é obrigatório." })
    .max(100, { message: "Nome do grupo deve ter no máximo 100 caracteres." }),
  description: z
    .string()
    .trim()
    .max(1000, {
      message: "Descrição do grupo deve ter no máximo 1000 caracteres.",
    })
    .optional(),
});

export interface CreateGroupFormState extends GeneralFormState {
  errors?: {
    name?: string[];
    description?: string[];
  };
}
