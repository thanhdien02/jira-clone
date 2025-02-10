import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  workspaceId: string;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  description?: string;
};


// export type Task = {
//   name: string;
//   project: string;
//   assignee: string;
//   dueDate: Date;
//   status: TaskStatus;
// };

// export const tasks: Task[] = [
//   {
//     name: "task 1",
//     project: "project 1",
//     assignee: "m@example.com",
//     dueDate: "20/10/2025",
//     status: TaskStatus.BACKLOG,
//   },
//   {
//     name: "task 2",
//     project: "project 2",
//     assignee: "m2@example.com",
//     dueDate: "20/10/2025",
//     status: TaskStatus.TODO,
//   },
//   {
//     name: "task 3",
//     project: "project 3",
//     assignee: "m@example.com",
//     dueDate: "20/10/2025",
//     status: TaskStatus.IN_REVIEW,
//   },
//   {
//     name: "task 4",
//     project: "project 4",
//     assignee: "m@example.com",
//     dueDate: "20/10/2025",
//     status: TaskStatus.DONE,
//   },
//   {
//     name: "task 5",
//     project: "project 2",
//     assignee: "m@example.com",
//     dueDate: "20/10/2025",
//     status: TaskStatus.IN_REVIEW,
//   },
// ];
