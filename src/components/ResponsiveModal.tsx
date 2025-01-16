import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
}
const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg outline-none w-full overflow-y-auto p-0">
          <DialogTitle className="hidden"></DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="hide-scrollbar overflow-y-auto max-h-[85vh]">
        <DrawerTitle className="hidden"></DrawerTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveModal;
