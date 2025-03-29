import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schema";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { generateInviteCode } from "@/lib/utils";
import { Member, MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/queries";
import { Workspace } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Project } from "@/features/projects/types";

const app = new Hono()
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

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

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = "";
      }
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });
      return c.json({ data: workspace });
    }
  )
  .post(
    "/:workspaceId/join",
    zValidator(
      "json",
      z.object({
        code: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { code } = c.req.valid("json");
      const { workspaceId } = c.req.param();

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (code !== workspace.inviteCode) {
        return c.json({ data: { error: "Invalid invite" } }, 400);
      }
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId,
        role: MemberRole.MEMBER,
      });
      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId/reset-invite",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        inviteCode: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId } = c.req.param();
      const { inviteCode } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          inviteCode,
        }
      );

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      let uploadedImageUrl: string | undefined;

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
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }
      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace });
    }
  )
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json({ data: { error: "Unauthorized" } }, 401);
    }

    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("userId", user.$id)]
    );

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );

    if (members.total > 0) {
      await Promise.all(
        members.documents.map(async (member) => {
          return await databases.deleteDocument(
            DATABASE_ID,
            MEMBERS_ID,
            member.$id
          );
        })
      );
    }

    // projects
    const projects = await databases.listDocuments<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );
    if (projects.total > 0) {
      await Promise.all(
        projects.documents.map(async (project) => {
          return await databases.deleteDocument(
            DATABASE_ID,
            PROJECTS_ID,
            project.$id
          );
        })
      );
    }

    // tasks
    const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
    ]);
    if (tasks.total > 0) {
      await Promise.all(
        tasks.documents.map(async (task) => {
          return await databases.deleteDocument(
            DATABASE_ID,
            TASKS_ID,
            task.$id
          );
        })
      );
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } }, 200);
  })
  .get("/:workspaceId/statistics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const taskDifferent = taskCount - lastMonthTasks.total;

    // assigned tasks

    const thisMonthAssignedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthAssignedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDifferent =
      assignedTaskCount - lastMonthAssignedTasks.total;

    // completed tasks

    const thisMonthCompletedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthCompletedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const completedTaskCount = thisMonthCompletedTasks.total;
    const completedTaskDifferent =
      completedTaskCount - lastMonthCompletedTasks.total;

    // incomplete tasks
    const thisMonthInCompleteTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthInCompleteTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const inCompleteTaskCount = thisMonthInCompleteTasks.total;
    const inCompleteTaskDifferent =
      inCompleteTaskCount - lastMonthInCompleteTasks.total;

    // overdue tasks
    const thisMonthOverdueTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthOverdueTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTaskDifferent = overdueTaskCount - lastMonthOverdueTasks.total;
    return c.json({
      data: {
        taskCount,
        taskDifferent,
        assignedTaskCount,
        assignedTaskDifferent,
        completedTaskCount,
        completedTaskDifferent,
        inCompleteTaskCount,
        inCompleteTaskDifferent,
        overdueTaskCount,
        overdueTaskDifferent,
      },
    });
  })
  .get("/:workspaceId/my-statistic", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // all tasks assigned me
    try {
      const thisMonthTasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthTasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const taskThisMonthCount = thisMonthTasks.total;
      const taskDifferentCount = taskThisMonthCount - lastMonthTasks.total;

      // tasks assigned to me has been completed
      const thisMonthTasksCompleted = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.equal("status", TaskStatus.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );
      const lastMonthTasksCompleted = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.equal("status", TaskStatus.DONE),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );
      const taskThisMonthCompletedCount = thisMonthTasksCompleted.total;
      const taskDifferentCompletedCount =
        taskThisMonthCompletedCount - lastMonthTasksCompleted.total;

      // tasks assigned to me has been incompleted
      const thisMonthTasksInCompleted = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.notEqual("status", TaskStatus.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );
      const lastMonthTasksInCompleted = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.notEqual("status", TaskStatus.DONE),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );
      const taskThisMonthInCompletedCount = thisMonthTasksInCompleted.total;
      const taskDifferentInCompletedCount =
        taskThisMonthInCompletedCount - lastMonthTasksInCompleted.total;

      // tasks assigned to me has been overdue

      const thisMonthTasksOverDue = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.notEqual("status", TaskStatus.DONE),
          Query.lessThan("dueDate", now.toISOString()),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );
      const lastMonthTasksOverDue = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.notEqual("status", TaskStatus.DONE),
          Query.lessThan("dueDate", now.toISOString()),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );
      const taskThisMonthOverDueCount = thisMonthTasksOverDue.total;
      const taskDifferentOverDueCount =
        taskThisMonthOverDueCount - lastMonthTasksOverDue.total;
      return c.json({
        data: {
          taskThisMonthCount,
          taskDifferentCount,
          taskThisMonthCompletedCount,
          taskDifferentCompletedCount,
          taskThisMonthInCompletedCount,
          taskDifferentInCompletedCount,
          taskThisMonthOverDueCount,
          taskDifferentOverDueCount,
        },
      });
    } catch (error) {
      console.log("🚀 ~ .get ~ error:", error);
    }
    return c.json({ error: "error" }, 401);
  });

export default app;
