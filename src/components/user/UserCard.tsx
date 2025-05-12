import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "./Avatar";
import { RoleBadge } from "./RoleBadge";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/user";
import { TableActions } from "../../../../role-based-education-sphere/src/components/tables/TableActions";
import StatusBadge from "../../../../role-based-education-sphere/src/components/tables/StatusBadge";

// Create a namespace for UserCard to hold Avatar component
const UserCardAvatar = ({
  user,
  size = "md",
  className = "",
}: {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) => {
  return <Avatar user={user} size={size} className={className} />;
};

interface UserCardProps {
  user: User;
  actions?: boolean;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onApprove?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export const UserCard = ({
  user,
  actions = true,
  onView,
  onEdit,
  onApprove,
  onDelete,
}: UserCardProps) => {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 text-center">
        <div className="flex justify-center mb-2">
          <Avatar user={user} size="lg" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex justify-center">
            <RoleBadge role={user.role} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{user.email}</span>
          </div>

          {user.department && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span>{user.department}</span>
            </div>
          )}

          {user.school && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">School:</span>
              <span>{user.school}</span>
            </div>
          )}

          {user.batch && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch:</span>
              <span>{user.batch}</span>
            </div>
          )}

          {user.section && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Section:</span>
              <span>{user.section}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <StatusBadge status={user.isApproved ? "approved" : "pending"} />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Joined:</span>
            <span>{formatDate(user.createdAt?.toString())}</span>
          </div>
        </div>
      </CardContent>

      {actions && (
        <CardFooter className="pt-2">
          <TableActions
            onView={onView ? () => onView(user) : undefined}
            onEdit={onEdit ? () => onEdit(user) : undefined}
            onDelete={onDelete ? () => onDelete(user) : undefined}
            additionalActions={
              !user.isApproved && onApprove
                ? [
                    {
                      label: "Approve",
                      onClick: () => onApprove(user),
                      variant: "default",
                      className: "bg-primary",
                    },
                  ]
                : undefined
            }
            value={user} // Add value prop to fix TS error
          />
        </CardFooter>
      )}
    </Card>
  );
};

// Attach Avatar component to UserCard namespace
UserCard.Avatar = UserCardAvatar;

export default UserCard;
