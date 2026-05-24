import { api } from "@/lib/api";
import {
  CreatePlayerPayload,
  PlayerProfile,
  PlayerUser,
  ResetPlayerPasswordPayload,
  ResetPlayerPasswordResponse,
} from "@/types/players";

export async function getPlayers(): Promise<PlayerProfile[]> {
  const response = await api.get<PlayerProfile[]>("/players/players/");

  return response.data;
}

export async function createPlayer(
  payload: CreatePlayerPayload
): Promise<PlayerUser> {
  const response = await api.post<PlayerUser>(
    "/auth/admin/players/create/",
    payload
  );

  return response.data;
}

export async function resetPlayerPassword(
  playerId: number,
  payload: ResetPlayerPasswordPayload
): Promise<ResetPlayerPasswordResponse> {
  const response = await api.post<ResetPlayerPasswordResponse>(
    `/players/players/${playerId}/reset-password/`,
    payload
  );

  return response.data;
}
