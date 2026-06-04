export type RoundStatus = "SCHEDULED" | "OPEN" | "CLOSED" | "SCORED" | "CANCELED";

export type Round = {
  id: number;
  game: number;
  game_name: string;
  schedule: number;
  schedule_name: string;
  day_number: number;
  date: string;
  starts_at: string;
  ends_at: string;
  selected_suit: number | null;
  selected_suit_name: string | null;
  selected_suit_symbol: string | null;
  started_by: number | null;
  started_by_username: string | null;
  status: RoundStatus;
  created_at: string;
  updated_at: string;
};

export type GameRound = {
  id: number;
  game: number;
  game_name?: string;
  day_number: number;
  is_active: boolean;
  starts_at?: string;
  ends_at?: string;
  plays_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type RoundActionResponse = {
  detail: string;
  is_active?: boolean;
};
