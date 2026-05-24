export type GameStatus = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELED";

export type Game = {
  id: number;
  name: string;
  description: string;
  group: number;
  group_name: string;
  start_date: string;
  end_date: string;
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