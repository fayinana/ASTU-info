import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export interface TableActionsProps {
  row?: any;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmCancelLabel?: string;
  confirmActionLabel?: string;
  hideDanger?: boolean;
  hideView?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  additionalActions?: Array<{
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    className?: string;
  }>;
  value?: any;
}

export const TableActions = ({
  row,
  onView,
  onEdit,
  onDelete,
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",
  confirmTitle = "Are you sure?",
  confirmDescription = "This action cannot be undone.",
  confirmCancelLabel = "Cancel",
  confirmActionLabel = "Continue",
  hideDanger = false,
  hideView = false,
  hideEdit = false,
  hideDelete = false,
  additionalActions = [],
  value,
}: TableActionsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  return (
    <>
      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{confirmCancelLabel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive"
            >
              {confirmActionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!hideView && onView && (
            <DropdownMenuItem onClick={onView}>
              <Eye className="mr-2 w-4 h-4" /> {viewLabel}
            </DropdownMenuItem>
          )}
          {!hideEdit && onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 w-4 h-4" /> {editLabel}
            </DropdownMenuItem>
          )}
          {!hideDelete && onDelete && (
            <DropdownMenuItem
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive"
            >
              <Trash className="mr-2 w-4 h-4" /> {deleteLabel}
            </DropdownMenuItem>
          )}
          {additionalActions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={action.className}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TableActions;
