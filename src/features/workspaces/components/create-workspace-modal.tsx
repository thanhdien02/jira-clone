"use client";

import ResponsiveModal from "@/components/ResponsiveModal";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import CreateWorkspaceForm from "./create-workspace-form";

const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};

export default CreateWorkspaceModal;
