export type MessageRole = "user" | "assistant";

export type MessageStatus = "idle" | "loading" | "received" | "approved" | "rejected" | "error";

export interface ExpenseData {
  estabelecimento: string | null;
  categoria: string | null;
  valor: string | null;
  metodoPagamento: string | null;
  parcelas?: string | number | null;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  status: MessageStatus;
  errorMessage?: string;
  expense?: ExpenseData | null;
  createdAt: string;
}

export type AssistantPayloadKind = "expense" | "text" | "error";

export interface AssistantPayload {
  kind: AssistantPayloadKind;
  message: string;
  expense?: ExpenseData | null;
  text?: string;
}

export interface ChatMessageResponse {
  id: number;
  userId: number;
  sender: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}