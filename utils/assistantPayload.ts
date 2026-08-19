import { AssistantPayload, ExpenseData } from "../interfaces/chat";

const EXPENSE_KEYS = ["estabelecimento", "categoria", "valor", "metodoPagamento"];

export function parseAssistantPayload(body: string): AssistantPayload {
  try {
    const parsed = JSON.parse(body);

    if (parsed && typeof parsed === "object") {
      if (parsed.error === true) {
        return {
          kind: "error",
          message:
            typeof parsed.message === "string"
              ? parsed.message
              : "Não foi possível processar a resposta.",
        };
      }

      const data = parsed.data;

      if (data && typeof data === "object" && !Array.isArray(data)) {
        const hasExpenseKeys = EXPENSE_KEYS.some((key) => key in data);

        if (hasExpenseKeys) {
          return {
            kind: "expense",
            message: typeof parsed.message === "string" ? parsed.message : "",
            expense: data as ExpenseData,
          };
        }
      }

      if (typeof data === "string") {
        return { kind: "text", message: "", text: data };
      }
    }
  } catch (error) {
    // payload is plain text, fall through
  }

  return { kind: "text", message: "", text: body };
}