import { useQueryState, parseAsBoolean } from "nuqs";

const useEditProjectModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "edit-project",
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

export default useEditProjectModal;
