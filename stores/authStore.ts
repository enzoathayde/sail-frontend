import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import { Session } from "../interfaces/auth";

const JWT_STORAGE_KEY = "jwt";
const USER_ID_STORAGE_KEY = "userId";
const USER_NAME_STORAGE_KEY = "userName";
const VAULT_KEY_STORAGE_KEY = "vaultKey";

interface AuthState {
  id: number | null;
  userName: string | null;
  token: string | null;
  vaultKey: string | null;
  setSession: (session: Session) => Promise<void>;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  id: null,
  userName: null,
  token: null,
  vaultKey: null,

  setSession: async (session) => {
    set({
      id: session.id,
      userName: session.userName,
      token: session.token,
      vaultKey: session.vaultKey ?? null,
    });

    await AsyncStorage.multiSet([
      [JWT_STORAGE_KEY, session.token],
      [USER_ID_STORAGE_KEY, String(session.id)],
      [USER_NAME_STORAGE_KEY, session.userName],
      [VAULT_KEY_STORAGE_KEY, session.vaultKey ?? ""],
    ]);
  },

  clearSession: async () => {
    set({ id: null, userName: null, token: null, vaultKey: null });

    await AsyncStorage.multiRemove([
      JWT_STORAGE_KEY,
      USER_ID_STORAGE_KEY,
      USER_NAME_STORAGE_KEY,
      VAULT_KEY_STORAGE_KEY,
    ]);
  },
}));