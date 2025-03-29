"use client";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { DatePicker } from "@/components/date-picker";

import useGetMembers from "@/features/members/api/use-get-members";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";

import useTaskFilters from "../hooks/use-task-filters";
import useGetProjects from "@/features/projects/api/use-get-projects";
const TaskFilter = () => {
  const workspaceId = useWorkspaceId();
  const { data: members } = useGetMembers({ workspaceId });
  const { data: projects } = useGetProjects({ workspaceId });
  const memberOptions = members?.documents.map((member) => ({
    label: member.name,
    value: member.$id,
  }));
  const projectOptions = projects?.documents.map((project) => ({
    label: project.name,
    value: project.$id,
  }));

  const [{ dueDate, projectId, assigneeId, status }, setFilters] =
    useTaskFilters();

  const onChangeStatus = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };
  const onChangeProject = (value: string) => {
    setFilters({ projectId: value === "all" ? null : value });
  };
  const onChangeAssignee = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : value });
  };

  return (
    <div className="flex items-center flex-wrap md:flex-nowrap gap-4 w-full">
      <Select defaultValue={status ?? undefined} onValueChange={onChangeStatus}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All status</SelectItem>
            <SelectSeparator />
            <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
            <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={onChangeAssignee}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            {!assigneeId && <UserIcon className="size-4 mr-2" />}
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectSeparator />
            {memberOptions?.map((member) => (
              <SelectItem key={member.value} value={member.value}>
                <div className="flex items-center max-w-[200px]">
                  <MemberAvatar name={member.label} />
                  <span className="ml-2 truncate">{member?.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={onChangeProject}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="All project" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project?.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <DatePicker
        value={dueDate ? new Date(dueDate) : undefined}
        className="h-8 w-full lg:w-auto"
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
        placeholder="Due date"
      />
    </div>
  );
};

export default TaskFilter;
