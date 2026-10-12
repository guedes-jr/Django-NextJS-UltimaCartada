export type JourneyStatus = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELED";

export type JourneyStage = {
  id: number;
  order: number;
  name: string;
  duration_days: number;
};

export type Journey = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  interval_days: number;
  daily_enabled: boolean;
  status: JourneyStatus;
  is_active: boolean;
  stages: JourneyStage[];
  enrollments_count: number;
  games_count: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateJourneyPayload = {
  daily_enabled?: boolean;
  name: string;
  description: string;
  start_date: string;
  interval_days: number;
  status: JourneyStatus;
  is_active: boolean;
  stages: Array<{ order: number; name: string }>;
  group_ids?: number[];
  generate_rounds?: boolean;
};

export type JourneyGame = {
  id: number;
  game: number;
  game_name: string;
  stage_order: number;
  stage_name: string;
  start_date: string;
  end_date: string;
  status: string;
  rounds_count: number;
};

export type JourneyEnrollment = {
  id: number;
  journey: number;
  journey_name: string;
  group: number;
  group_name: string;
  status: string;
  journey_games: JourneyGame[];
  enrolled_at: string;
  updated_at: string;
};

export type EnrollGroupsPayload = {
  group_ids: number[];
  generate_rounds: boolean;
};

export type EnrollGroupsResponse = {
  detail: string;
  groups_enrolled: number;
  games_created: number;
  rounds_created: number;
};

export type JourneyPillar = "BODY" | "NUTRITION" | "MINDSET" | "COMMUNITY";
export type DailyEvidenceType = "NONE" | "TEXT" | "IMAGE" | "VIDEO" | "IMAGE_OR_VIDEO";

export type JourneyDay = {
  id: number; stage: number; stage_order: number; day_number: number;
  pillar: JourneyPillar; pillar_label: string; title: string; objective: string;
  content: string; instruction: string; expected_evidence: string;
  conclusion_message: string; incentive_message: string; alternative_instruction: string;
  precautions: string; image: string | null; evidence_type: DailyEvidenceType;
  intention_points: number; evidence_points: number; release_time: string;
  is_published: boolean;
};
export type JourneyDayPayload = Omit<JourneyDay, "id" | "stage_order" | "pillar_label" | "image">;
export type DailyParticipation = {
  id: number; journey_game: number; day: number; day_title: string; day_number: number;
  stage_order: number; pillar: JourneyPillar; intention: string; intention_at: string | null;
  evidence_text: string; evidence_at: string | null; has_file: boolean;
  intention_points: number; evidence_points: number; total_points: number;
  completed_at: string | null; conclusion_message: string;
};
export type DailyPillarProgress = {
  pillar: JourneyPillar; label: string; total_days: number; released_days: number;
  played_days: number; evidence_days: number; points: number;
};
export type DailyJourneyProgress = {
  enrollment: number; journey_name: string; group_name: string; status: string;
  journey_status: JourneyStatus; current_stage: number | null; current_day_number: number | null;
  current_day: JourneyDay | null; participation: DailyParticipation | null;
  can_send_evidence: boolean; evidence_due_at: string | null;
  points: number; played_days: number; total_days: number; pillars: DailyPillarProgress[];
  stages: Array<{ order: number; name: string; status: string; start_date: string;
    end_date: string; played_days: number; points: number; pillars: DailyPillarProgress[] }>;
  next_stage_start: string | null; history: DailyParticipation[];
};

export type DailyGroupPillar = {
  pillar: JourneyPillar;
  label: string;
  played_days: number;
  participants: number;
  points: number;
};
