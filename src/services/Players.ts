import type { Player } from "@/types/dataTypes";
import { api } from "@/lib/apiClient";

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
