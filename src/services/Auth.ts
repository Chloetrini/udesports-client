import { api } from "@/lib/api";
import type { AdminRole } from "@/types/dataTypes";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
}

// A Super Admin can only ever grant one of these two roles — never another
// Super Admin (there's exactly one, set up at deploy time).
export type GrantableRole = "ADMIN" | "SUB_ADMIN";

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

// The logged-in admin editing their own name/email, and optionally their
// password (currentPassword required when newPassword is set).
export const updateProfile = async (data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<AdminUser> => {
  const res = await api.put<{ admin: AdminUser }>("/auth/profile", data);
  return res.body!.admin;
};

// Super Admin only — team management.
export const getAllAdmins = async (): Promise<Admin[]> => {
  const res = await api.get<{ count: number; admins: Admin[] }>("/auth/admins");
  return res.body?.admins ?? [];
};

export const inviteAdmin = async (data: {
  name: string;
  email: string;
  role: GrantableRole;
}): Promise<{ admin: Admin; emailSent: boolean }> => {
  const res = await api.post<{ admin: Admin; emailSent: boolean }>("/auth/invite", data);
  return res.body as { admin: Admin; emailSent: boolean };
};

export const updateAdmin = async (
  id: string,
  data: { name?: string; email?: string; role?: GrantableRole }
): Promise<Admin> => {
  const res = await api.put<{ admin: Admin }>(`/auth/admins/${id}`, data);
  return res.body!.admin;
};

export const deleteAdmin = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/auth/admins/${id}`);
};
