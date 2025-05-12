import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User } from "@/types/user";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

export const Avatar = ({ user, size = "md", className = "" }: AvatarProps) => {
  const initials = getInitials(user.name);
  const sizeClass = sizeClasses[size];

  return (
    <ShadcnAvatar className={`${sizeClass} ${className}`}>
      <AvatarImage src={user.profilePic} alt={user.name} />
      <AvatarFallback
        className="bg-primary text-white"
        style={{ fontSize: size === "sm" ? "0.75rem" : undefined }}
      >
        {initials}
      </AvatarFallback>
    </ShadcnAvatar>
  );
};

export default Avatar;
