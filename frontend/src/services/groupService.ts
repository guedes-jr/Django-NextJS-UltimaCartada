import { api } from "@/lib/api";
import {
  AddPlayerToGroupPayload,
  CreateGroupPayload,
  PlayerGroup,
  GroupActionResponse
} from "@/types/groups";

export async function getGroups(): Promise<PlayerGroup[]> {
  const response = await api.get<PlayerGroup[]>("/groups/groups/");

  return response.data;
}

export async function createGroup(payload: CreateGroupPayload): Promise<PlayerGroup> {
  const response = await api.post<PlayerGroup>("/groups/groups/", payload);

  return response.data;
}

export async function addPlayerToGroup(
  groupId: number,
  payload: AddPlayerToGroupPayload
): Promise<GroupActionResponse> {
  const response = await api.post<GroupActionResponse>(
    `/groups/groups/${groupId}/add-player/`,
    payload
  );

  return response.data;
}

export async function removePlayerFromGroup(
  groupId: number,
  payload: AddPlayerToGroupPayload
): Promise<GroupActionResponse> {
  const response = await api.post<GroupActionResponse>(
    `/groups/groups/${groupId}/remove-player/`,
    payload
  );

  return response.data;
}
