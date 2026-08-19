import { Platform } from "react-native";

import { apiClient } from "./api";
import { JWT_COOKIE_NAME } from "../constants/auth";
import { MeResponse, StandardResponse, VaultAuthResponse, VaultUserResponse } from "../interfaces/auth";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

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

export async function getCurrentUser(): Promise<MeResponse> {
  const response = await apiClient.get<StandardResponse<MeResponse>>("/vault-users/me");

  return response.data.data;
}

export async function getStoredCookieToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return null;
  }

  const CookieManager = require("@react-native-cookies/cookies") as typeof import("@react-native-cookies/cookies").default;
  const cookies = await CookieManager.get(API_BASE_URL ?? "");

  return cookies[JWT_COOKIE_NAME]?.value ?? null;
}