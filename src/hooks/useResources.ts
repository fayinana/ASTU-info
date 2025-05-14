import { createResource, fetchResources } from "@/api/resource";
import { GetResourcesQuery } from "@/types/resource";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import { toast } from "sonner";

export function useResources(query: GetResourcesQuery) {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["recource", query],
    queryFn: () => fetchResources(query),
  });

  return {
    resources: data?.resources || [],
    pagination: data?.pagination || {
      limit: 10,
      page: 1,
      total: 0,
      totalPages: 1,
    },
    error,
    isLoading,
    refetch,
  };
}

export const useUploadResource = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      toast.success("Resource uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload resource: ${error.message}`);
    },
  });

  return {
    uploadResource: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      // This is a stub - will be implemented when deleteResource is available
      return id;
    },
    onSuccess: () => {
      toast.success("Resource deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete resource: ${error.message}`);
    },
  });

  return {
    deleteResource: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

// export const useUpdateResource = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: (formData: FormData) => {
//       // This is a stub - will be implemented when updateResource is available
//       return Promise.resolve({
//         message: "Resource updated",
//         resource: {} as Resource,
//       });
//     },
//     onSuccess: () => {
//       toast.success("Resource updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["resources"] });
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to update resource: ${error.message}`);
//     },
//   });

//   return {
//     updateResource: mutation.mutate,
//     isLoading: mutation.isPending,
//     error: mutation.error,
//     reset: mutation.reset,
//   };
// };
