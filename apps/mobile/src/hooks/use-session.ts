import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/http";
import { useAuthStore } from "../store/auth-store";

export function useRequireToken() {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    throw new Error("未登录");
  }
  return token;
}

export function useDevLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: { email: string; displayName: string }) =>
      apiClient.auth.devLogin(payload),
    onSuccess: async (result) => {
      await setSession({ token: result.token, user: result.user });
    }
  });
}

export function useProfileOverviewQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["profile-overview", token],
    enabled: Boolean(token),
    queryFn: async () => apiClient.profile.overview(token!)
  });
}

export function useRefreshAfterMutation() {
  const client = useQueryClient();
  return async () => {
    await client.invalidateQueries();
  };
}

