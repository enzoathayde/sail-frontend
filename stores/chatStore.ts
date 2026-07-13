import { create } from "zustand";

import { ChatMessage, ExpenseSuggestion } from "../interfaces/chat";

interface ChatStore {
  messages: ChatMessage[];
  isSending: boolean;
  setIsSending: (value: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updater: (message: ChatMessage) => ChatMessage) => void;
  updateSuggestionStatus: (suggestionId: string, status: "approved" | "rejected") => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isSending: false,
  setIsSending: (value) => set({ isSending: value }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateMessage: (messageId, updater) =>
    set((state) => ({
      messages: state.messages.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        return updater(message);
      }),
    })),
  updateSuggestionStatus: (suggestionId, status) =>
    set((state) => ({
      messages: state.messages.map((message) => {
        const suggestion: ExpenseSuggestion | undefined = message.suggestion;

        if (!suggestion || suggestion.id !== suggestionId) {
          return message;
        }

        return {
          ...message,
          status,
        };
      }),
    })),
}));
