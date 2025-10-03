import { z } from "zod";

export const SendMessageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Message content is required" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

export type SendMessageFormState = {
  message?: string;
  errors?: {
    content?: string[];
  };
  success?: boolean;
};
