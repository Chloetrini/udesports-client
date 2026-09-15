import { api } from "@/lib/api";
import type { AdminRole } from "@/types/dataTypes";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export const login = async (email: string, password: string): Promise<{ admin: AdminUser }> => {
  const res = await api.post<{ admin: AdminUser }>("/auth/login", { email, password });
  return res.body as { admin: AdminUser };
};

export const logout = async (): Promise<void> => {
  await api.post<undefined>("/auth/logout");
};

export const getMe = async (): Promise<{ admin: AdminUser }> => {
  const res = await api.get<{ admin: AdminUser }>("/auth/me");
  return res.body as { admin: AdminUser };
};

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post<undefined>("/auth/forgot-password", { email });
};

export const verifyResetCode = async (email: string, code: string): Promise<void> => {
  await api.post<undefined>("/auth/verify-reset-code", { email, code });
};

export const resetPassword = async (
  email: string,
  code: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  await api.put<undefined>("/auth/reset-password", { email, code, password, confirmPassword });
};

// Activates an invited admin — token comes from the emailed invite link's
// `?token=` query param.
export const setPassword = async (
  token: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  await api.put<undefined>(`/auth/set-password/${token}`, { password, confirmPassword });
};

