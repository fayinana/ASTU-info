
import { Badge } from "@/components/ui/badge";
import { USER_ROLE_COLORS, USER_ROLES } from "@/lib/constants";
import { UserRole } from "@/lib/types";

interface RoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RoleBadge = ({ role, size = "md", className = "" }: RoleBadgeProps) => {
  // Role-specific styling
  const roleStyles: Record<UserRole, string> = {
    admin: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    teacher: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    student: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
  };

  // Size variations
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1"
  };

  return (
    <Badge
      variant="outline"
      className={`font-medium ${roleStyles[role]} ${sizeClasses[size]} ${className}`}
    >
      {USER_ROLES[role]}
    </Badge>
  );
};

export default RoleBadge;
