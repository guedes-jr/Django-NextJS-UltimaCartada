export type PlayerUser = {
  id: number;
  user: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  is_active: boolean;
  must_change_password?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PlayerProfile = {
  id: number;
  user: PlayerUser;
  nickname: string;
  birth_date: string | null;
  notes: string;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export type CreatePlayerPayload = {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  nickname: string;
  notes: string;
};

export type ResetPlayerPasswordPayload = {
  new_password: string;
  confirm_password: string;
};

export type ResetPlayerPasswordResponse = {
  detail: string;
};

export type TogglePlayerActiveResponse = {
  detail: string;
  is_active: boolean;
};
