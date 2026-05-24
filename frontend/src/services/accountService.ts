import { api } from "@/lib/api";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
  CurrentUserResponse,
} from "@/types/accounts";

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await api.get<CurrentUserResponse>("/accounts/me/");

  return response.data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>(
    "/accounts/change-password/",
    payload
  );

  return response.data;
}
