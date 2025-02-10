"use client";

import ResponsiveModal from "@/components/responsive-modal";
import useEditProjectModal from "../hooks/use-edit-project-modal";
import useGetProject from "../api/use-get-project";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useProjectId from "../hooks/use-project-id";
import EditProjectForm from "./edit-project-form";

const EditProjectModal = () => {
  const { isOpen, setIsOpen, close } = useEditProjectModal();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { data: project } = useGetProject({ projectId, workspaceId });
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <EditProjectForm
        onCancel={close}
        initialValues={{
          name: project?.name as string,
          imageUrl: project?.imageUrl as string,
          id: project?.$id as string,
        }}
      />
    </ResponsiveModal>
  );
};

export default EditProjectModal;
