import { sendMessage as sendMessageApi } from "@/api/chat";
import { useMutation, useQuery } from "@tanstack/react-query";

const useSendMessage = () => {
  const { mutate: sendMissage, isPending: isSending } = useMutation({
    mutationKey: ["message"],
    mutationFn: sendMessageApi,
  });

  return { sendMissage, isSending };
};

export default useSendMessage;
