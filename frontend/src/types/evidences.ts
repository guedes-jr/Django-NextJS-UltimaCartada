export type EvidenceStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Evidence = {
  id: number;
  play: number;
  player_username: string;
  player_name: string;
  card_title: string;
  card_code: string;
  card_suit_symbol: string;
  card_value: number;
  round_day: number;
  game_name: string;
  text: string;
  file: string | null;
  status: EvidenceStatus;
  reviewed_by: number | null;
  reviewed_at: string | null;
  admin_notes: string;
  created_at: string;
  updated_at: string;
};

export type CreateEvidencePayload = {
  play: number;
  text: string;
  file?: File | null;
};

export type ReviewEvidencePayload = {
  admin_notes: string;
};
