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
