// import { assignTeacherResponsibilities as assignTeacherResponsibilitiesApi } from "@/api/auth";
import { fetchUsers } from "@/api/user";
import { GetUsersQuery } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignTeacherResponsibilities as assignTeacherResponsibilitiesApi } from "@/api/auth";
// import { toast } from "sonner";

export const useUsers = (query: GetUsersQuery = {}) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["users", query],
    queryFn: () => fetchUsers(query),
    staleTime: 1000 * 60 * 5,
  });

  return {
    users: data?.users || [],
    pagination: {
      limit: 10,
      page: 1,
      total: 0,
      totalPages: 1,
    },
    error,
    isLoading,
    refetch,
  };
};

// //   const { data, error, isLoading, refetch } = useQuery({
// //     queryKey: ["user", studentId],
// //     queryFn: () => getUsers(studentId),
// //     staleTime: 1000 * 60 * 5, // 5 minutes cache
// //     enabled: !!studentId, // Only run query if studentId exists
// //   });

// // //   return {
// // //     data: data || null,
// // //     error,
// // //     isLoading,
// // //     refetch,
// // //   };
// // // };

// // export const useFilterStudents = (filters: StudentFilterParams) => {
// //   return useQuery({
// //     queryKey: ["students", filters],
// //     queryFn: () => filterStudentsBySection(filters),
// //     enabled: !!filters.section, // Only run query when section is provided
// //   });
// // };

// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();

//   const {
//     mutate: updateUserProfile,
//     isPending: isLoading,
//     error,
//     reset,
//   } = useMutation({
//     mutationFn: updateUserProfileApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//       toast.success("Profile updated successfully");
//     },
//     onError: (error) => {
//       toast.error("Failed to update profile");
//     },
//   });

//   return {
//     updateUserProfile,
//     isLoading,
//     error,
//     reset,
//   };
// };

export const useAssignTeacherResponsibilities = () => {
  const queryClient = useQueryClient();

  const {
    mutate: assignTeacherResponsibilities,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: assignTeacherResponsibilitiesApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Responsibilities assigned successfully");
    },
    onError: (error) => {
      toast.error("Failed to assign responsibilities");
    },
  });

  return {
    assignTeacherResponsibilities,
    isLoading,
    error,
    reset,
  };
};
