export type MessageRole = "user" | "assistant";

export type MessageStatus = "idle" | "loading" | "approved" | "rejected" | "error";

export interface ExpenseSuggestion {
  id: string;
  summary: string;
  merchant: string;
  amountBRL: number;
  paymentMethod: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  status: MessageStatus;
  suggestion?: ExpenseSuggestion;
  errorMessage?: string;
  createdAt: string;
}

export interface ExpenseParseResponse {
  replyText: string;
  suggestion: ExpenseSuggestion;
}
