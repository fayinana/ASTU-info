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
  value?: any; // For compatibility with DataTable
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

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        {additionalActions?.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            size="sm"
            onClick={action.onClick}
            className={action.className}
          >
            {action.label}
          </Button>
        ))}

        {onView && !hideView && (
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="bg-background border-muted-foreground/20 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            {viewLabel}
          </Button>
        )}

        {!hideEdit && onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="bg-background border-muted-foreground/20 text-muted-foreground hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            {editLabel}
          </Button>
        )}

        {onDelete && !hideDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className={
              !hideDanger
                ? "bg-background border-muted-foreground/20 text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                : "bg-background border-muted-foreground/20 text-muted-foreground"
            }
          >
            <Trash className="h-3.5 w-3.5 mr-1" />
            {deleteLabel}
          </Button>
        )}
      </div>
    </>
  );
};

export default TableActions;
