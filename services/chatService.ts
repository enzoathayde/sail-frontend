import { apiClient } from "./api";
import { ChatMessageResponse } from "../interfaces/chat";
import { StandardResponse } from "../interfaces/auth";

export async function sendChatMessage(
  userId: number,
  content: string,
): Promise<ChatMessageResponse> {
  const response = await apiClient.post<StandardResponse<ChatMessageResponse>>("/chat/messages", {
    userId,
    content,
  });

  return response.data.data;
}