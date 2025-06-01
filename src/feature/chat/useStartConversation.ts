// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {toast }from "sonner";

// function useStartConversation() {
//   const queryClient = useQueryClient();

//   const { mutate: startConversation, isLoading: isStartingConversation } =
//     useMutation({
//       mutationFn: createConversation,
//       onSuccess: (newConversation) => {
//         queryClient.invalidateQueries({ queryKey: ["conversations"] });
//         toast.success("Conversation started successfully");
//       },
//     });

//   return { startConversation, isStartingConversation };
// }

// export default useStartConversation;
