export type EvidenceStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Evidence = {
  id: number;
  play: number;
  player_username: string;
  card_title: string;
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
