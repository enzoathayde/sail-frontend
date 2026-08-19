export interface StandardResponse<T> {
  message: string;
  error: boolean;
  data: T;
}

export interface VaultUserResponse {
  id: number;
  userName: string;
  vaultKey: string;
  token: string;
}

export interface VaultAuthResponse {
  id: number;
  userName: string;
  token: string;
}

export interface Session {
  id: number;
  userName: string;
  token: string;
  vaultKey?: string;
}

export interface MeResponse {
  id: number;
  userName: string;
}