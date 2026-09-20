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
