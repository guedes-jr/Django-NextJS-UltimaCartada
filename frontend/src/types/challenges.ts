export type ChallengeStatus = "DRAFT" | "PUBLISHED" | "CANCELED";
export type ChallengeAvailability = "DRAFT" | "SCHEDULED" | "ACTIVE" | "CLOSED" | "CANCELED";
export type ChallengeEvidenceType = "TEXT" | "FILE" | "ANY";
export type ChallengeSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type FlashChallengeSubmission = {
  id: number;
  challenge: number;
  challenge_title: string;
  player: number;
  player_name: string;
  player_username: string;
  group: number;
  group_name: string;
  text: string;
  file: string | null;
  status: ChallengeSubmissionStatus;
  points_awarded: number;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_notes: string;
  submitted_at: string;
  updated_at: string;
};

export type FlashChallenge = {
  id: number;
  title: string;
  description: string;
  instruction: string;
  groups: number[];
  group_names: string[];
  starts_at: string;
  ends_at: string;
  points: number;
  evidence_type: ChallengeEvidenceType;
  status: ChallengeStatus;
  availability_status: ChallengeAvailability;
  published_at: string | null;
  submissions_count: number;
  player_submission: FlashChallengeSubmission | null;
  created_at: string;
  updated_at: string;
};

export type CreateFlashChallengePayload = {
  title: string;
  description: string;
  instruction: string;
  groups: number[];
  starts_at: string;
  ends_at: string;
  points: number;
  evidence_type: ChallengeEvidenceType;
  status: ChallengeStatus;
};

export type ChallengeRankingEntry = {
  position: number;
  player_id: number;
  player_name: string;
  username: string;
  group_id: number;
  group_name: string;
  points: number;
};
