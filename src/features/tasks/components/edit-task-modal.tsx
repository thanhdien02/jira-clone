"use client";

import ResponsiveModal from "@/components/responsive-modal";
import useEditTaskModal from "../hooks/use-edit-task-modal";
import EditTaskWrapper from "./edit-task-wrapper";

const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskWrapper onCancel={close} taskId={taskId} />}
    </ResponsiveModal>
  );
};

export default EditTaskModal;
