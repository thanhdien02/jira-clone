import { useQueryState, parseAsString } from "nuqs";

const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);
  const open = (value: string) => {
    setTaskId(value);
  };
  const close = () => {
    setTaskId(null);
  };
  return { open, close, taskId, setTaskId };
};

export default useEditTaskModal;
