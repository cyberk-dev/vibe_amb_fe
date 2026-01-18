import { z } from "zod";

export const joinGameSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be 20 characters or less")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
});

export type JoinGameFormData = z.infer<typeof joinGameSchema>;
