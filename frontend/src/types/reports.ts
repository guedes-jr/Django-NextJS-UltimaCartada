import { PlayerRanking } from "./scoring";

export type ReportPeriodType = "quarter" | "year";

export type ReportFilters = {
  period: ReportPeriodType;
  year: number;
  quarter?: number;
  group?: number;
  journey?: number;
  game?: number;
};

export type ReportPeriod = {
  label: string;
  start_date: string;
  end_date: string;
  year: number;
  quarter: number | null;
  type: ReportPeriodType;
};

export type ReportTotals = {
  groups: number;
  games: number;
  eligible_players: number;
  active_players: number;
  participation_rate: number;
  total_plays: number;
  valid_plays: number;
  total_points: number;
  bonus_points: number;
  total_evidences: number;
  approved_evidences: number;
  pending_evidences: number;
  rejected_evidences: number;
  on_time_evidences: number;
  missing_evidences: number;
  approval_rate: number;
  challenge_submissions: number;
  approved_challenge_submissions: number;
  challenge_points: number;
};

export type GroupReportSummary = {
  group_id: number;
  group_name: string;
  total_players: number;
  active_players: number;
  total_plays: number;
  total_points: number;
  approved_evidences: number;
};

export type PeriodicReportSummary = {
  period: ReportPeriod;
  totals: ReportTotals;
  by_group: GroupReportSummary[];
  ranking: PlayerRanking[];
};

export type ReportTimeseriesItem = {
  month: number;
  label: string;
  plays: number;
  points: number;
  players: number;
  evidences: number;
  approved_evidences: number;
};
