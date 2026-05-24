import { AuthUser } from "@/lib/auth";

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export type ChangePasswordResponse = {
  detail: string;
};

export type CurrentUserResponse = AuthUser;
