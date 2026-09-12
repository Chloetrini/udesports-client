#!/usr/bin/env bash
set -euo pipefail
echo "Applying UDESPORT round-8: fix src/lib/api.ts (generic + /api + PUT) and repoint Auth.ts/Players.ts imports at it..."

mkdir -p "$(dirname "src/lib/api.ts")"
cat > "src/lib/api.ts" << 'UDE8_01_EOF'
import axios from 'axios'

// Eventra-style axios client, adapted to the UDESport backend: routes are
// mounted at plain `/api/...` (not `/api/v1`), and updates use PUT (not
// PATCH) — see src/server.ts + src/routes/*.routes.ts on udesports-server.
//
// The backend replies with either:
//   { success: true,  message: string, body?: T }
//   { success: false, message: string, details?: unknown }
// and auth is a JWT stored in an httpOnly cookie set by /auth/login, so
// every request needs `withCredentials: true` for that cookie to be sent.

function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return '/api'
  return raw.replace(/\/+$/, '')
}

const BASE_URL = resolveBaseUrl()

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const SESSION_MISSING_MESSAGE = 'Unauthorized: please log in to continue'
function friendlyErrorMessage(message: string | undefined): string | undefined {
  return message === SESSION_MISSING_MESSAGE ? "We couldn't verify your session. Please try again." : message
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  body?: T
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<ApiEnvelope<T>> {
  try {
    const response = await axiosClient.request({
      method,
      url: path,
      data: body,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { message } = error.response.data ?? {}
      throw new Error(friendlyErrorMessage(message) || 'Request failed', { cause: error })
    }
    throw new Error('Network error', { cause: error })
  }
}

// Multipart uploads (FormData) need their own path: the client's default
// 'Content-Type: application/json' header must NOT be sent, or the browser
// never gets a chance to set the multipart boundary itself and the server
// can't parse the body. Overriding it to `undefined` here drops it for this
// request only.
async function upload<T = unknown>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<ApiEnvelope<T>> {
  try {
    const response = await axiosClient.request({
      method,
      url: path,
      data: formData,
      headers: { 'Content-Type': undefined },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { message } = error.response.data ?? {}
      throw new Error(friendlyErrorMessage(message) || 'Upload failed', { cause: error })
    }
    throw new Error('Network error', { cause: error })
  }
}

export const api = {
  get: <T = unknown>(path: string) => request<T>('GET', path),
  post: <T = unknown>(path: string, body?: unknown) =>
    body instanceof FormData ? upload<T>(path, body, 'POST') : request<T>('POST', path, body),
  put: <T = unknown>(path: string, body?: unknown) =>
    body instanceof FormData ? upload<T>(path, body, 'PUT') : request<T>('PUT', path, body),
  delete: <T = unknown>(path: string, body?: unknown) => request<T>('DELETE', path, body),
}
UDE8_01_EOF
echo "  wrote src/lib/api.ts"

mkdir -p "$(dirname "src/services/Auth.ts")"
cat > "src/services/Auth.ts" << 'UDE8_02_EOF'
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
UDE8_02_EOF
echo "  wrote src/services/Auth.ts"

mkdir -p "$(dirname "src/services/Players.ts")"
cat > "src/services/Players.ts" << 'UDE8_03_EOF'
import type { Player } from "@/types/dataTypes";
import { api } from "@/lib/api";

export const fetchAllPlayers = async (): Promise<Player[]> => {
  const res = await api.get<{ count: number; players: Player[] }>("/players");
  return res.body?.players ?? [];
};

export const fetchSinglePlayer = async (id: string): Promise<Player | null> => {
  if (!id) return null;
  const res = await api.get<{ player: Player }>(`/players/${id}`);
  return res.body?.player ?? null;
};

// `data` may include a `playerPhoto` File (multipart) or be plain fields (JSON).
export const createPlayer = async (data: Record<string, unknown>): Promise<Player> => {
  const res = await api.post<{ player: Player }>("/players", toRequestBody(data));
  return res.body!.player;
};

export const updatePlayer = async (id: string, data: Record<string, unknown>): Promise<Player> => {
  const res = await api.put<{ player: Player }>(`/players/${id}`, toRequestBody(data));
  return res.body!.player;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/players/${id}`);
};

// Builds a FormData body when a photo File is present (so express-fileupload
// on the backend receives it), otherwise sends plain JSON.
function toRequestBody(data: Record<string, unknown>): FormData | Record<string, unknown> {
  const hasFile = data.playerPhoto instanceof File;
  if (!hasFile) return data;

  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    formData.append(key, value instanceof File ? value : String(value));
  }
  return formData;
}
UDE8_03_EOF
echo "  wrote src/services/Players.ts"

echo ""
echo "Done. Next steps:"
echo "  npx tsc --noEmit -p tsconfig.app.json && npx eslint . && npm run build"
