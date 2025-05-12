
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footerButtons?: React.ReactNode;
  closeLabel?: string;
}

export const InfoModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footerButtons,
  closeLabel = "Close",
}: InfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-between">
          {footerButtons ? (
            footerButtons
          ) : (
            <Button onClick={onClose}>{closeLabel}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
