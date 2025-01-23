import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { Member, MemberRole } from "../types";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getMember } from "../queries";
import { updateMemberSchema } from "../schema";

const app = new Hono()
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

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      return c.json({ data: members });
    }
  )
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", updateMemberSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const memberToUpdate = await databases.getDocument<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (member.role !== "ADMIN") {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, member.$id, {
        role: MemberRole.MEMBER,
      });

      return c.json({ data: memberId });
    }
  );

export default app;
