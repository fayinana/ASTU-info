
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { User } from "@/lib/types";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const MobileNav = ({ isOpen, onClose, user }: MobileNavProps) => {
  if (!user) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
