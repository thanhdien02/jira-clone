"use client";

import { Loader } from "lucide-react";

import useGetMembers from "@/features/members/api/use-get-members";
import useGetProjects from "@/features/projects/api/use-get-projects";
import useGetTask from "../api/use-get-task";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import EditTaskForm from "./edit-task-form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface EditTaskWrapperProps {
  taskId: string;
  onCancel?: () => void;
}
const EditTaskWrapper = ({ taskId, onCancel }: EditTaskWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: members } = useGetMembers({ workspaceId });
  const { data: projects } = useGetProjects({ workspaceId });
  const { data: initialTask, isLoading } = useGetTask({
    taskId: taskId as string,
  });
  const dataMembers =
    members?.documents.map((member) => ({
      id: member.$id,
      name: member.name,
    })) || [];

  const dataProjects =
    projects?.documents.map((project) => ({
      id: project.$id,
      name: project.name,
    })) || [];

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardTitle></CardTitle>
        <CardContent className="h-full px-7 py-20 flex items-center justify-center">
          <Loader className="size-6 text-neutral-500 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  if (!initialTask) {
    return null;
  }

  return (
    <EditTaskForm
    taskId={taskId}
      onCancel={onCancel}
      initialValues={initialTask}
      project={dataProjects}
      assignee={dataMembers}
    />
  );
};

export default EditTaskWrapper;
