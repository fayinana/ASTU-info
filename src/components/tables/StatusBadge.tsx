
import { Badge } from "@/components/ui/badge";

type StatusType = "pending" | "approved" | "rejected" | "active" | "inactive" | "success" | "error" | "warning" | "info" | "secondary";

interface StatusBadgeProps {
  status: StatusType | string;
  text?: string;
  className?: string;
}

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; className: string; text: string }> = {
    pending: { 
      variant: "outline", 
      className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", 
      text: "Pending" 
    },
    approved: { 
      variant: "default", 
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200", 
      text: "Approved" 
    },
    rejected: { 
      variant: "destructive", 
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200", 
      text: "Rejected" 
    },
    active: { 
      variant: "default", 
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200", 
      text: "Active" 
    },
    inactive: { 
      variant: "outline", 
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200", 
      text: "Inactive" 
    },
    success: { 
      variant: "default", 
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200", 
      text: "Success" 
    },
    error: { 
      variant: "destructive", 
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200", 
      text: "Error" 
    },
    warning: { 
      variant: "secondary", 
      className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", 
      text: "Warning" 
    },
    info: { 
      variant: "outline", 
      className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", 
      text: "Info" 
    },
    secondary: { 
      variant: "secondary", 
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200", 
      text: "Secondary" 
    },
  };

  return statusMap[status.toLowerCase()] || { 
    variant: "outline", 
    className: "bg-gray-100 text-gray-800 border-gray-200", 
    text: status 
  };
};

export const StatusBadge = ({ status, text, className = "" }: StatusBadgeProps) => {
  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={`font-medium ${config.className} ${className}`}
    >
      {text || config.text}
    </Badge>
  );
};

export default StatusBadge;
