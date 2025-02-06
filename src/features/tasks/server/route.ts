import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schema";
import { getMember } from "@/features/members/queries";
import { DATABASE_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";

export const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", createTaskSchema),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { name, description, assigneeId, workspaceId, projectId, status } =
      c.req.valid("json");

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let position: number;
    const taskLast = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);
    if (taskLast.total > 0) {
      position = taskLast.documents[0].position + 1000;
    } else {
      position = 1000;
    }
    
    const task = await databases.createDocument(
      DATABASE_ID,
      TASKS_ID,
      ID.unique(),
      {
        name,
        description,
        assigneeId,
        workspaceId,
        projectId,
        position,
        status,
      }
    );

    return c.json({ data: task });
  }
);
export default app;
