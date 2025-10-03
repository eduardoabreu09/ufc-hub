import { z } from "zod";

export const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Group name is required" })
    .max(100, { message: "Group name must be less than 100 characters" }),
  description: z.string().optional(),
});

export type CreateGroupFormState = {
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
  };
  success?: boolean;
};
