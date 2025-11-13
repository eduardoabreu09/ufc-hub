import { GeneralFormState } from "@/types/form";
import { z } from "zod";

export const CreateEventFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Título é obrigatório." })
    .max(100, { message: "Título deve ter no máximo 100 caracteres." })
    .trim(),
  description: z
    .string()
    .min(1, { message: "Descrição é obrigatória." })
    .max(1000, {
      message: "Descrição do evento deve ter no máximo 1000 caracteres.",
    })
    .trim(),
  body: z
    .string()
    .min(1, { message: "Detalhes do evento é obrigatório." })
    .max(20000, {
      message: "Corpo do evento deve ter no máximo 20000 caracteres.",
    })
    .trim(),
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
    .min(1, { message: "Local é obrigatório." })
    .max(1000, {
      message: "Local do evento deve ter no máximo 1000 caracteres.",
    })
    .trim(),
  imageUrl: z
    .url({ message: "URL da imagem deve ser válida." })
    .max(1000, {
      message: "URL deve ter no máximo 1000 caracteres.",
    })
    .trim()
    .optional(),
  tags: z
    .string()
    .min(1, { message: "Tags é obrigatório." })
    .max(500, {
      message: "Tags devem ter no máximo 500 caracteres.",
    })
    .trim(),
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
