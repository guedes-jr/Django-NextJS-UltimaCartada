import { api } from "@/lib/api";
import { CreateGroupPayload, PlayerGroup } from "@/types/groups";

export async function getGroups(): Promise<PlayerGroup[]> {
  const response = await api.get<PlayerGroup[]>("/groups/groups/");

  return response.data;
}

export async function createGroup(
  payload: CreateGroupPayload
): Promise<PlayerGroup> {
  const response = await api.post<PlayerGroup>("/groups/groups/", payload);

  return response.data;
}
