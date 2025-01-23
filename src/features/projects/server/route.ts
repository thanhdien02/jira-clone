import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProjectSchema } from "../schema";
import { getMember } from "@/features/members/queries";
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Project } from "../types";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, workspaceId, image } = c.req.valid("form");
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      let updatedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );
        updatedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        updatedImageUrl = "";
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: updatedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: project });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: projects });
    }
  );

export default app;
