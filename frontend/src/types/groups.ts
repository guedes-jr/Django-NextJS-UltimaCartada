import { PlayerProfile } from "./players";

export type PlayerGroup = {
  id: number;
  name: string;
  description: string;
  players: PlayerProfile[];
  max_players: number;
  total_players: number;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateGroupPayload = {
  name: string;
  description: string;
  player_ids: number[];
  max_players: number;
  is_active: boolean;
};
