import { api } from "@/lib/api";
import { GameSummary, PlayerRanking } from "@/types/scoring";

export async function getGameSummary(gameId: number): Promise<GameSummary> {
  const response = await api.get<GameSummary>(
    `/scoring/games/${gameId}/summary/`
  );

  return response.data;
}

export async function getGameRanking(gameId: number): Promise<PlayerRanking[]> {
  const response = await api.get<PlayerRanking[]>(
    `/scoring/games/${gameId}/ranking/`
  );

  return response.data;
}
