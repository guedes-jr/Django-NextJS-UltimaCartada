import { api } from "@/lib/api";
import { CreatePlayPayload, Play } from "@/types/plays";

export async function getPlays(): Promise<Play[]> {
  const response = await api.get<Play[]>("/plays/plays/");

  return response.data;
}

export async function createPlay(payload: CreatePlayPayload): Promise<Play> {
  const response = await api.post<Play>("/plays/plays/", payload);

  return response.data;
}
