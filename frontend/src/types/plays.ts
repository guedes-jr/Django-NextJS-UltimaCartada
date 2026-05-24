export type PlayStatus = "PENDING" | "VALID" | "INVALID" | "CANCELED";

export type Play = {
  id: number;
  game: number;
  group: number;
  round: number;
  player: number;
  player_username: string;
  card: number;
  card_title: string;
  card_value: number;
  card_suit: string;
  card_suit_symbol: string;
  card_suit_color: string;
  round_day: number;
  played_at: string;
  is_within_time: boolean;
  is_round_starter: boolean;
  base_points: number;
  bonus_points: number;
  total_points: number;
  status: PlayStatus;
  invalid_reason: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
};

export type CreatePlayPayload = {
  round: number;
  card: number;
};
