import { ExpenseParseResponse } from "../interfaces/chat";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const MOCK_DELAY_MS = 900;

function wait(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return response.json() as Promise<T>;
}

function buildMockSuggestion(message: string): ExpenseParseResponse {
  const normalizedMessage = message.trim();

  return {
    replyText: "Encontrei um gasto para revisar antes de salvar no seu histórico.",
    suggestion: {
      id: `mock-${Date.now()}`,
      summary: normalizedMessage || "Compra registrada no chat",
      merchant: "Estabelecimento não confirmado",
      amountBRL: 37.9,
      paymentMethod: "Cartão de débito",
    },
  };
}

export async function sendExpenseMessage(
  message: string,
  clientMessageId: string,
): Promise<ExpenseParseResponse> {
  if (!API_BASE_URL) {
    await wait(MOCK_DELAY_MS);
    return buildMockSuggestion(message);
  }

  const response = await fetch(`${API_BASE_URL}/v1/chat/expense-parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      clientMessageId,
    }),
  });

  return parseJsonResponse<ExpenseParseResponse>(response);
}

export async function approveSuggestion(id: string): Promise<{ status: "approved" }> {
  if (!API_BASE_URL) {
    await wait(350);
    return { status: "approved" };
  }

  const response = await fetch(`${API_BASE_URL}/v1/expense-suggestions/${id}/approve`, {
    method: "POST",
  });

  return parseJsonResponse<{ status: "approved" }>(response);
}

export async function rejectSuggestion(id: string): Promise<{ status: "rejected" }> {
  if (!API_BASE_URL) {
    await wait(350);
    return { status: "rejected" };
  }

  const response = await fetch(`${API_BASE_URL}/v1/expense-suggestions/${id}/reject`, {
    method: "POST",
  });

  return parseJsonResponse<{ status: "rejected" }>(response);
}
