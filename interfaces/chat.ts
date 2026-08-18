export type MessageRole = "user" | "assistant";

export type MessageStatus = "idle" | "loading" | "received" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  status: MessageStatus;
  errorMessage?: string;
  createdAt: string;
}

export interface ChatMessageResponse {
  id: number;
  userId: number;
  sender: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}