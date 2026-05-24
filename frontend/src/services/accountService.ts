import { api } from "@/lib/api";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/types/accounts";

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>(
    "/accounts/change-password/",
    payload
  );

  return response.data;
}
