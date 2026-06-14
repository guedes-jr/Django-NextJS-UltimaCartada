import { UserSummary } from "./accounts";

export type GameStatus = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELED";

export type Game = {
  id: number;
  name: string;
  description: string;
  group: number;
  group_name: string;
  mediators: UserSummary[];
  start_date: string;
  end_date: string;
  total_rounds: number;
  rounds_count?: number;
  duration_days: number;
  status: GameStatus;
  evidence_bonus_points: number;
  lowest_card_points: number;
  middle_card_points: number;
  highest_card_points: number;
  max_round_starts_per_player_per_day: number;
  allow_late_play: boolean;
  show_ranking_to_players: boolean;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateGamePayload = {
  name: string;
  description: string;
  group: number | "";
  start_date: string;
  end_date: string;
  total_rounds: number;
  duration_days: number;
  status: GameStatus;
  evidence_bonus_points: number;
  lowest_card_points: number;
  middle_card_points: number;
  highest_card_points: number;
  max_round_starts_per_player_per_day: number;
  allow_late_play: boolean;
  show_ranking_to_players: boolean;
  is_active: boolean;
};

export type GameActionResponse = {
  detail: string;
  is_active?: boolean;
};
