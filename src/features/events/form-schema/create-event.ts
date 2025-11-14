import { GeneralFormState } from "@/types/form";
import { z } from "zod";

export const CreateEventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Título é obrigatório." })
    .max(100, { message: "Título deve ter no máximo 100 caracteres." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Descrição é obrigatória." })
    .max(1000, {
      message: "Descrição do evento deve ter no máximo 1000 caracteres.",
    }),
  body: z
    .string()
    .trim()
    .min(1, { message: "Detalhes do evento é obrigatório." })
    .max(20000, {
      message: "Corpo do evento deve ter no máximo 20000 caracteres.",
    }),
  eventDate: z.iso
    .datetime({
      message: "Selecione uma data e hora válidas para o evento.",
    })
    .refine(
      (val) => new Date(val) > new Date(),
      "Data do evento deve ser no futuro."
    ),
  location: z
    .string()
    .trim()
    .min(1, { message: "Local é obrigatório." })
    .max(1000, {
      message: "Local do evento deve ter no máximo 1000 caracteres.",
    }),
  imageUrl: z
    .url({ message: "URL da imagem deve ser válida." })
    .trim()
    .max(1000, {
      message: "URL deve ter no máximo 1000 caracteres.",
    })
    .optional(),
  tags: z.string().trim().min(1, { message: "Tags é obrigatório." }).max(500, {
    message: "Tags devem ter no máximo 500 caracteres.",
  }),
});

export interface CreateEventFormSchema extends GeneralFormState {
  errors?: {
    title?: string[];
    description?: string[];
    body?: string[];
    eventDate?: string[];
    location?: string[];
    imageUrl?: string[];
    tags?: string[];
  };
}
