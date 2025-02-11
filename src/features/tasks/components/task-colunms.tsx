import { ColumnDef } from "@tanstack/react-table";
import { Task, TaskStatus } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import TaskAction from "./task-action";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Task Name <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1 font-medium">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Project <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            src={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: () => (
      <Button variant={"ghost"}>
        Assignee <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Due Date <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Status <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <Badge variant={status as TaskStatus}>
          {snakeCaseToTitleCase(status as string)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <TaskAction>
          <Button variant={"ghost"} size={"icon"} type="button">
            <MoreVertical className="size-4" />
          </Button>
        </TaskAction>
      );
    },
  },
];
