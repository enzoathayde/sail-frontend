export interface TransactionResponse {
  id: number;
  userId: number;
  estabelecimento: string | null;
  categoria: string | null;
  metodoPagamento: string | null;
  valorCents: number;
  valorReal: number;
  computada: boolean;
  feitoEm: string | null;
  mesParcela: number;
  parcelasTotais: number;
  createdAt: string;
}