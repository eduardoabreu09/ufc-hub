import { GeneralFormState } from "@/types/form";
import { z } from "zod";

export const SendMessageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Mensagem deve ter corpo" })
    .max(1000, { message: "Limite máximo de 1000 caracteres" })
    .trim(),
});

export interface SendMessageFormState extends GeneralFormState {
  errors?: {
    content?: string[];
  };
}
