import { User } from "@/lib/types";
import { Avatar } from "./Avatar";
import { RoleBadge } from "./RoleBadge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Mail,
  MapPin,
  School,
  User as UserIcon,
} from "lucide-react";
import StatusBadge from "../../../../role-based-education-sphere/src/components/tables/StatusBadge";

interface UserProfileDetailsProps {
  user: User;
  className?: string;
  compact?: boolean;
}

export function UserProfileDetails({
  user,
  className = "",
  compact = false,
}: UserProfileDetailsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div
          className={`${
            compact ? "flex items-center space-x-4" : "text-center"
          }`}
        >
          {compact ? (
            <>
              <Avatar user={user} size={compact ? "md" : "xl"} />
              <div className="space-y-1">
                <CardTitle className="flex items-center">{user.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <RoleBadge role={user.role} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-3">
                <Avatar user={user} size="xl" />
              </div>
              <CardTitle className="flex justify-center">{user.name}</CardTitle>
              <div className="flex justify-center space-x-2 my-2">
                <RoleBadge role={user.role} />
              </div>
              <p className="text-muted-foreground flex justify-center items-center">
                <Mail className="h-4 w-4 mr-1" />
                {user.email}
              </p>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {!compact && <Separator />}

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <UserIcon className="h-4 w-4 mr-2" />
                <span>Username</span>
              </div>
              <span className="font-medium">{user.username}</span>
            </div>

            {user.department && (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Department</span>
                </div>
                <span className="font-medium">{user.department}</span>
              </div>
            )}

            {user.school && (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <School className="h-4 w-4 mr-2" />
                  <span>School</span>
                </div>
                <span className="font-medium">{user.school}</span>
              </div>
            )}

            {(user.batch || user.section) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {user.role === "student" ? "Batch/Section" : "Section"}
                  </span>
                </div>
                <span className="font-medium">
                  {user.batch && user.batch}
                  {user.batch && user.section && " - "}
                  {user.section && user.section}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Joined</span>
              </div>
              <span className="font-medium">{formatDate(user.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <span>Status</span>
              </div>
              <StatusBadge status={user.isApproved ? "Approved" : "Pending"} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserProfileDetails;
