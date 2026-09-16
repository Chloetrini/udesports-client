import type { Player } from "@/types/dataTypes";
import { api } from "@/lib/api";

export const fetchAllPlayers = async (): Promise<Player[]> => {
  const res = await api.get<{ count: number; players: Player[] }>("/players");
  return res.body?.players ?? [];
};

// Admin-only — includes drafts (published: false), unlike the public list above.
export const fetchAllPlayersAdmin = async (): Promise<Player[]> => {
  const res = await api.get<{ count: number; players: Player[] }>("/players/admin/all");
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

export interface BulkImportRowResult {
  playerName: string;
  success: boolean;
  error?: string;
}

// Bulk import — text/JSON only (no photo/logo files here, same as a CSV
// can't carry binary images). Every row is created as a draft; the server
// processes each row independently and reports per-row success/failure
// instead of failing the whole batch on one bad row.
export const bulkCreatePlayers = async (
  players: Record<string, unknown>[]
): Promise<BulkImportRowResult[]> => {
  const res = await api.post<{ results: BulkImportRowResult[] }>("/players/bulk", { players });
  return res.body?.results ?? [];
};

export const deletePlayer = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/players/${id}`);
};

// Builds a FormData body when any image File is present (playerPhoto or
// either club logo) so express-fileupload on the backend receives it,
// otherwise sends plain JSON.
function toRequestBody(data: Record<string, unknown>): FormData | Record<string, unknown> {
  const hasFile =
    data.playerPhoto instanceof File ||
    data.previousClubLogo instanceof File ||
    data.currentClubLogo instanceof File;
  if (!hasFile) return data;

  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    formData.append(key, value instanceof File ? value : String(value));
  }
  return formData;
}
