import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { Member, MemberRole } from "../types";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getMember } from "../queries";
import { updateMemberSchema } from "../schema";
import { createAdminClient } from "@/lib/appwrite";

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
      const { users } = await createAdminClient();
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

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
          };
        })
      );

      return c.json({ data: { ...member, documents: populatedMembers } });
    }
  )
  .get(
    "/info",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
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
      return c.json({ data: member });
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
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { memberId } = c.req.param();

    const memberToDelete = await databases.getDocument<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: memberToDelete.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized2" }, 401);
    }

    if (member.role !== "ADMIN") {
      // out workspace
      if (memberId === member.$id) {
        await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);
        return c.json({ data: memberId });
      }
      return c.json({ error: "Unauthorized1" }, 401);
    }

    // if user out is admin
    if (memberId === member.$id) {
      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToDelete.workspaceId)]
      );
      const memberFinal = members.documents.filter(
        (member) => member.$id !== memberId
      );
      if (memberFinal.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          MEMBERS_ID,
          memberFinal[0].$id,
          {
            role: MemberRole.ADMIN,
          }
        );
      }
    }
    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: memberId });
  });

export default app;
