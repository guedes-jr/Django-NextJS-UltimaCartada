import { api } from "@/lib/api";
import { GameRound, RoundActionResponse, Round } from "@/types/rounds";

export async function getRounds(): Promise<Round[]> {
  const response = await api.get<Round[]>("/rounds/rounds/");

  return response.data;
}

export async function getGameRounds(): Promise<GameRound[]> {
  const response = await api.get<GameRound[]>("/rounds/rounds/");

  return response.data;
}

export async function activateRound(
  roundId: number
): Promise<RoundActionResponse> {
  const response = await api.post<RoundActionResponse>(
    `/rounds/rounds/${roundId}/activate/`
  );

  return response.data;
}

export async function closeRound(
  roundId: number
): Promise<RoundActionResponse> {
  const response = await api.post<RoundActionResponse>(
    `/rounds/rounds/${roundId}/close/`
  );

  return response.data;
}
