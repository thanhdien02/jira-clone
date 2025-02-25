import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema, updateTaskSchema } from "../schema";
import { getMember } from "@/features/members/queries";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";
import { createAdminClient } from "@/lib/appwrite";
export const app = new Hono()
  .get("/:taskId", sessionMiddleware, async (c) => {
    const { users } = await createAdminClient();
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: task.workspaceId,
    });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );
    const assignee = await databases.getDocument<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );
    const userInfo = await users.get(assignee.userId);

    return c.json({
      data: {
        ...task,
        project,
        assignee: {
          ...assignee,
          name: userInfo.name || userInfo.email,
          email: userInfo.email,
        },
      },
    });
  })
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const taskToDelete = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: taskToDelete.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const task = await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: task });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        projectId: z.string().nullish(),
        workspaceId: z.string(),
        search: z.string().optional().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const user = c.get("user");
      const databases = c.get("databases");
      const { projectId, workspaceId, status, assigneeId, dueDate, search } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 404);

      const queries = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];
      if (projectId) {
        queries.push(Query.equal("projectId", projectId));
      }
      if (search) {
        queries.push(Query.search("name", search));
      }
      if (status) {
        queries.push(Query.equal("status", status));
      }
      if (assigneeId) {
        queries.push(Query.equal("assigneeId", assigneeId));
      }
      if (dueDate) {
        queries.push(Query.equal("dueDate", dueDate));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        queries
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );
      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const {
        name,
        description,
        assigneeId,
        workspaceId,
        projectId,
        status,
        dueDate,
      } = c.req.valid("json");

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
        Query.equal("status", status),
        Query.equal("workspaceId", workspaceId),
        Query.equal("projectId", projectId),
        Query.orderAsc("position"),
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
          dueDate,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.array(
        z.object({
          $id: z.string(),
          status: z.string(),
          position: z.number(),
        })
      )
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const dataTasks = c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            dataTasks.map((task) => task.$id)
          ),
        ]
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((data) => data.workspaceId)
      );
      if (workspaceIds.size !== 1) {
        return c.json({ error: "All tasks must belong to the same workspace" });
      }
      const workspaceId = workspaceIds.values().next().value;

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: workspaceId as string,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const tasks = await Promise.all(
        dataTasks?.map(async (dataTask) => {
          const task = await databases.updateDocument(
            DATABASE_ID,
            TASKS_ID,
            dataTask.$id,
            {
              status: dataTask.status,
              position: dataTask.position,
            }
          );
          return task;
        })
      );
      return c.json({ data: tasks });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", updateTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { name, projectId, status, description, assigneeId, dueDate } =
        c.req.valid("json");
      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: existingTask.workspaceId,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          description,
          assigneeId,
          projectId,
          status,
          dueDate,
        }
      );
      return c.json({ data: task });
    }
  );
export default app;
