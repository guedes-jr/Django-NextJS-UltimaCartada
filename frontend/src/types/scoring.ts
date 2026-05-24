export type GameSummary = {
  game_id: number;
  game_name: string;
  group_name: string;
  total_players: number;
  total_rounds: number;
  total_plays: number;
  total_evidences: number;
  approved_evidences: number;
  pending_evidences: number;
};

export type PlayerRanking = {
  player_id: number;
  username: string;
  full_name: string;
  total_points: number;
  total_plays: number;
  approved_evidences: number;
};
