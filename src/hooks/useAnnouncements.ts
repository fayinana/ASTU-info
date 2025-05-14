import {
  createPost as createAnnouncmentApi,
  deletePost as deleteAnnouncmentApi,
} from "@/api/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useCreateAnnouncement() {
  const navigate = useNavigate();
  const {
    mutate: createAnnouncment,
    error,
    isPending: isLoading,
    reset,
  } = useMutation({
    mutationFn: createAnnouncmentApi,
    mutationKey: ["announcment"],
    onSuccess: (data) => {
      toast.success("Announcement created successfully");
      navigate("/admin/announcements");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create announcement");
    },
  });

  return { createAnnouncment, error, isLoading, reset };
}

export function useDeleteAnnouncement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: deleteAnnouncment,
    isPending: isDeleteing,
    error,
  } = useMutation({
    mutationFn: deleteAnnouncmentApi,
    mutationKey: ["delete-announcement"],
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/admin/announcements");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete announcement");
    },
  });
  return { deleteAnnouncment, isDeleteing, error };
}
