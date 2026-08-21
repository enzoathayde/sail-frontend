import { apiClient } from "./api";
import { ChatMessageResponse } from "../interfaces/chat";
import { StandardResponse } from "../interfaces/auth";

export async function sendChatMessage(
  content: string,
): Promise<ChatMessageResponse> {
  const response = await apiClient.post<StandardResponse<ChatMessageResponse>>("/chat/messages", {
    content,
  });

  return response.data.data;
}

export async function getChatHistory(): Promise<ChatMessageResponse[]> {

  const response = await apiClient.get<StandardResponse<ChatMessageResponse[]>>("/chat/messages");

  return response.data.data;
}