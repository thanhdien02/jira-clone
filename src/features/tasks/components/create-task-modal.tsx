"use client";

import ResponsiveModal from "@/components/responsive-modal";
import CreateTaskForm from "./create-task-form";
import useCreateTaskModal from "../hooks/use-create-task-modal";
import useGetMembers from "@/features/members/api/use-get-members";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useGetProjects from "@/features/projects/api/use-get-projects";

const CreateTaskModal = () => {
  const workspaceId = useWorkspaceId();
  const { isOpen, setIsOpen, close } = useCreateTaskModal();
  const { data: members } = useGetMembers({ workspaceId });
  const { data: projects } = useGetProjects({ workspaceId });
  const dataMembers =
    members?.documents.map((member) => ({ id: member.$id, name: member.name })) || [];

  const dataProjects =
    projects?.documents.map((project) => ({
      id: project.$id,
      name: project.name,
    })) || [];
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskForm
        onCancel={close}
        assignee={dataMembers}
        project={dataProjects}
      />
    </ResponsiveModal>
  );
};

export default CreateTaskModal;
