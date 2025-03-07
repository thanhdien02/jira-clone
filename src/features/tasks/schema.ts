import { z } from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string(),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string(),
  description: z.string().optional(),
});
export const updateTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string(),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string(),
  description: z.string().optional(),
});
