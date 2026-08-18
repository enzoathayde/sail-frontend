import { apiClient } from "./api";
import { StandardResponse, VaultAuthResponse, VaultUserResponse } from "../interfaces/auth";

export async function registerVaultUser(): Promise<VaultUserResponse> {
  const response = await apiClient.post<StandardResponse<VaultUserResponse>>("/vault-users/generate");

  return response.data.data;
}

export async function authenticateVaultUser(vaultKey: string): Promise<VaultAuthResponse> {
  const response = await apiClient.post<StandardResponse<VaultAuthResponse>>("/vault-users/auth", {
    vaultKey,
  });

  return response.data.data;
}