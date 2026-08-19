import axios from "axios";
import { Platform } from "react-native";

import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

if (Platform.OS !== "web") {
  apiClient.interceptors.response.use((response) => {
    const setCookie = response.headers["set-cookie"];

    if (setCookie) {
      const header = Array.isArray(setCookie) ? setCookie.join(", ") : String(setCookie);
      const CookieManager = require("@react-native-cookies/cookies") as typeof import("@react-native-cookies/cookies").default;
      CookieManager.setFromResponse(API_BASE_URL ?? "", header).catch(() => undefined);
    }

    return response;
  });
}