import { GeneralFormState } from "@/types/form";
import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Título é obrigatório." })
    .max(100, { message: "Título deve ter no máximo 100 caracteres." }),
  body: z
    .string()
    .trim()
    .min(1, { message: "Resumo é obrigatório." })
    .max(300, { message: "Resumo deve ter no máximo 300 caracteres." }),
  content: z.string().trim().min(1, { message: "Conteúdo é obrigatório." }),
  tags: z
    .string()
    .trim()
    .min(1, { message: "Tags são obrigatórias." })
    .max(500, {
      message: "Tags devem ter no máximo 500 caracteres.",
    }),
});

export interface CreatePostFormState extends GeneralFormState {
  errors?: {
    title?: string[];
    body?: string[];
    content?: string[];
    tags?: string[];
  };
}
