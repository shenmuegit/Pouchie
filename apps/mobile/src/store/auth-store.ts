import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import type { User } from "@xiaohebao/contracts";
import { apiClient } from "../lib/http";

const TOKEN_KEY = "xiaohebao_token";

type AuthState = {
  initialized: boolean;
  token: string | null;
  user: User | null;
  boot: () => Promise<void>;
  setSession: (params: { token: string; user: User }) => Promise<void>;
  clearSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  initialized: false,
  token: null,
  user: null,
  boot: async () => {
    if (get().initialized) return;
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      set({ initialized: true, token: null, user: null });
      return;
    }
    try {
      const user = await apiClient.auth.me(token);
      set({ initialized: true, token, user });
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      set({ initialized: true, token: null, user: null });
    }
  },
  setSession: async ({ token, user }) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token, user, initialized: true });
  },
  clearSession: async () => {
    const token = get().token;
    if (token) {
      try {
        await apiClient.auth.logout(token);
      } catch {
        // ignore
      }
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, user: null, initialized: true });
  }
}));

