import { api } from "@/lib/api";
import { CreateGamePayload, Game } from "@/types/games";

type GenerateRoundsResponse = {
  detail: string;
  created_rounds: number;
};

export async function getGames(): Promise<Game[]> {
  const response = await api.get<Game[]>("/games/games/");

  return response.data;
}

export async function createGame(payload: CreateGamePayload): Promise<Game> {
  const response = await api.post<Game>("/games/games/", payload);

  return response.data;
}

export async function generateGameRounds(
  gameId: number
): Promise<GenerateRoundsResponse> {
  const response = await api.post<GenerateRoundsResponse>(
    `/games/games/${gameId}/generate-rounds/`
  );

  return response.data;
}