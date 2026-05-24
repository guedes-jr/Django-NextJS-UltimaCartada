import { api } from "@/lib/api";
import {
  CreateGamePayload,
  Game,
  GameActionResponse,
} from "@/types/games";

export async function getGames(): Promise<Game[]> {
  const response = await api.get<Game[]>("/games/games/");

  return response.data;
}

export async function createGame(payload: CreateGamePayload): Promise<Game> {
  const response = await api.post<Game>("/games/games/", payload);

  return response.data;
}

export async function toggleGameActive(
  gameId: number
): Promise<GameActionResponse> {
  const response = await api.post<GameActionResponse>(
    `/games/games/${gameId}/toggle-active/`
  );

  return response.data;
}

export async function generateGameRounds(
  gameId: number
): Promise<GameActionResponse> {
  const response = await api.post<GameActionResponse>(
    `/games/games/${gameId}/generate-rounds/`
  );

  return response.data;
}
