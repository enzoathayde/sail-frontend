import { apiClient } from "./api";
import { ExpenseData } from "../interfaces/chat";
import { StandardResponse } from "../interfaces/auth";
import { TransactionResponse } from "../interfaces/transaction";

export async function createTransaction(expense: ExpenseData): Promise<TransactionResponse[]> {
  const response = await apiClient.post<StandardResponse<TransactionResponse[]>>("/transactions", {
    estabelecimento: expense.estabelecimento,
    categoria: expense.categoria,
    metodoPagamento: expense.metodoPagamento,
    valor: expense.valor,
    parcelas:
      expense.parcelas !== null && expense.parcelas !== undefined && expense.parcelas !== ""
        ? Number(expense.parcelas)
        : null,
  });

  return response.data.data;
}