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

export type UserSummary = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
};
