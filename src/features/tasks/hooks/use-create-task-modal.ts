import { useQueryState, parseAsBoolean } from "nuqs";

const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };
  return { open, close, isOpen, setIsOpen };
};

export default useCreateTaskModal;
