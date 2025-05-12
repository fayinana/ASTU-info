
import { toast } from "sonner";

// Re-export toast but not useToast since it doesn't exist in sonner
export { toast };

// Export a compatibility useToast function
export const useToast = () => {
  return {
    toast,
  };
};
