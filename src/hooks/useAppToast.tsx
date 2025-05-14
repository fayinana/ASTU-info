
import { toast as sonnerToast } from "sonner";
import { Check, AlertTriangle, Info, X } from "lucide-react";
import { ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface AppToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useAppToast = () => {
  // We're returning React components rather than JSX directly
  const getIcon = (type: ToastType): ReactNode => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5" />;
      case "error":
        return <X className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const toast = (options: AppToastOptions) => {
    return sonnerToast(options.title, {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const success = (options: AppToastOptions) => {
    return sonnerToast.success(options.title || "Success", {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      icon: getIcon("success"),
    });
  };

  const error = (options: AppToastOptions) => {
    return sonnerToast.error(options.title || "Error", {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      icon: getIcon("error"),
    });
  };

  const warning = (options: AppToastOptions) => {
    return sonnerToast.warning(options.title || "Warning", {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      icon: getIcon("warning"),
    });
  };

  const info = (options: AppToastOptions) => {
    return sonnerToast.info(options.title || "Info", {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      icon: getIcon("info"),
    });
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
  };
};

// Add this alias export to allow importing { useToast } from this file
export const useToast = useAppToast;

export default useAppToast;
