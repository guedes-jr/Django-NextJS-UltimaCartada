import { PlayerRanking } from "./scoring";

export type CommunityReactionType = "LIKE" | "SUPPORT" | "CELEBRATE";
export type CommunityContentStatus = "PUBLISHED" | "HIDDEN";

export type CommunityPost = {
  id: number;
  author: number;
  author_name: string;
  author_username: string;
  author_avatar: string | null;
  group: number;
  group_name: string;
  game: number | null;
  game_name: string;
  evidence_file: string | null;
  evidence_text: string;
  evidence_card_title: string;
  text: string;
  media: string | null;
  origin: "MANUAL" | "EVIDENCE" | "ACHIEVEMENT";
  status: CommunityContentStatus;
  moderation_reason: string;
  reactions_count: number;
  reaction_counts: Record<CommunityReactionType, number>;
  comments_count: number;
  user_reaction: CommunityReactionType | null;
  is_own: boolean;
  can_moderate: boolean;
  created_at: string;
  updated_at: string;
};

export type CommunityComment = {
  id: number;
  post: number;
  author: number;
  author_name: string;
  author_username: string;
  author_avatar: string | null;
  text: string;
  status: CommunityContentStatus;
  is_own: boolean;
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type CreateCommunityPostPayload = {
  group: number;
  game?: number | null;
  text: string;
  evidence_id?: number | null;
  media?: File | null;
};

export type ReactionResponse = {
  user_reaction: CommunityReactionType | null;
  reaction_counts: Record<CommunityReactionType, number>;
  reactions_count: number;
};

export type CommunityRanking = PlayerRanking[];
