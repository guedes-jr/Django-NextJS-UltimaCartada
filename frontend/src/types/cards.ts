export type Suit = {
  id: number;
  name: string;
  symbol: string;
  color: string;
  theme: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CardDifficulty = "EASY" | "MEDIUM" | "HARD";

export type CardEvidenceType =
  | "NONE"
  | "TEXT"
  | "IMAGE"
  | "VIDEO"
  | "IMAGE_OR_VIDEO";

export type Card = {
  id: number;
  suit: number;
  suit_name: string;
  suit_symbol: string;
  suit_color: string;
  value: number;
  code: string;
  title: string;
  description: string;
  instruction: string;
  category: string;
  difficulty: CardDifficulty;
  estimated_minutes: number;
  image: string | null;
  requires_evidence: boolean;
  evidence_type: CardEvidenceType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateCardPayload = {
  suit: number | "";
  value: number;
  code: string;
  title: string;
  description: string;
  instruction: string;
  category: string;
  difficulty: CardDifficulty;
  estimated_minutes: number;
  requires_evidence: boolean;
  evidence_type: CardEvidenceType;
  is_active: boolean;
};
