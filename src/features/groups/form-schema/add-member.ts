import { GroupRole } from "@prisma/client";
import { z } from "zod";

export const AddMemberSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  role: z
    .enum([GroupRole.ADMIN, GroupRole.USER], {
      message: "Role must be ADMIN or MEMBER",
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
