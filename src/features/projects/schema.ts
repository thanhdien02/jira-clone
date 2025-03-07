import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Required"),
  workspaceId: z.string(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value !== "" ? value : undefined)),
    ])
    .optional(),
});
export const updateProjectSchema = z.object({
  name: z.string().min(1, "Required"),
  workspaceId: z.string(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value !== "" ? value : undefined)),
    ])
    .optional(),
});