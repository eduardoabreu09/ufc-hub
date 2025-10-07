import { z } from "zod";

export const SendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Mensagem deve ter corpo" })
    .max(1000, { message: "Limite máximo de 1000 caracteres" }),
});

export type SendMessageFormState = {
  message?: string;
  errors?: {
    content?: string[];
  };
  success?: boolean;
};
