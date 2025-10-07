import { GroupRole } from "@prisma/client";
import { z } from "zod";

export const AddMemberSchema = z.object({
  email: z.email({ error: "Email inválido." }).trim(),
  role: z
    .enum([GroupRole.ADMIN, GroupRole.USER], {
      message: "Função deve ser Admin ou Membro.",
    })
    .default("USER"),
});

export type AddMemberFormState = {
  message?: string;
  errors?: {
    email?: string[];
    role?: string[];
  };
  success?: boolean;
};
