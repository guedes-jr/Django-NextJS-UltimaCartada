import { api } from "@/lib/api";
import { Round } from "@/types/rounds";

export async function getRounds(): Promise<Round[]> {
  const response = await api.get<Round[]>("/rounds/rounds/");

  return response.data;
}
