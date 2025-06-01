// import { useState } from "react";
// import { createConversation } from "@/api/chat";
// import { User } from "@/types/user";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { MessageSquarePlus } from "lucide-react";
// import { toast } from "sonner";
// import { useAuth } from "@/context/AuthContext";
// import { useUsers } from "@/hooks/useUsers";
// import { Conversation } from "@/types/message";
// // import useStartConversation from "@/feature/chat/useStartConversation";

// interface StartChatDialogProps {
//   onConversationCreated: (conversationId: string) => void;
//   conversations: Conversation[];
// }

// export const StartChatDialog = ({
//   onConversationCreated,
//   conversations = [],
// }: StartChatDialogProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [loadingStates, setLoadingStates] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const { user } = useAuth();
//   // const { startConversation, isStartingConversation } = useStartConversation();
//   const { users, isLoading } = useUsers();
//   console.log("===================admins=================");
//   console.log(users);
//   console.log("====================================");
//   const handleStartChat = async (adminId: string) => {
//     try {
//       setLoadingStates((prev) => ({ ...prev, [adminId]: true }));

//       // If no existing conversation, create a new one
//       const conversation = await createConversation({
//         senderId: user._id,
//         receiverId: adminId,
//       });

//       onConversationCreated(conversation.data.conversation._id);

//       setIsOpen(false);
//       toast.success("Chat started successfully");
//     } catch {
//       toast.error("Failed to start chat");
//     } finally {
//       setLoadingStates((prev) => ({ ...prev, [adminId]: false }));
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="w-full">
//           <MessageSquarePlus className="w-4 h-4 mr-2" />
//           Start New Chat
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Start a chat with an admin</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 mt-4">
//           {isLoading ? (
//             <div>Loading admins...</div>
//           ) : (
//             users?.map((user: User) => (
//               <div
//                 key={user._id}
//                 className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//               >
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={user.profilePic || "/placeholder.svg"}
//                     alt={user.name}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <div>
//                     <h4 className="font-medium">{user.name}</h4>
//                     <p className="text-sm text-gray-500">{user.email}</p>
//                   </div>
//                 </div>
//                 {!conversations.find(
//                   (conversation) => conversation.participants[0] === user._id
//                 ) ? (
//                   <Button
//                     onClick={() => handleStartChat(user._id)}
//                     disabled={loadingStates[user._id]}
//                   >
//                     {loadingStates[user._id] ? "Loading..." : "Start Chat"}
//                   </Button>
//                 ) : (
//                   <Button disabled={true}>chat is Created</Button>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
