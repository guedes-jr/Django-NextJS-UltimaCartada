import { api } from "@/lib/api";
import {
  CommunityComment,
  CommunityPost,
  CommunityRanking,
  CommunityReactionType,
  CreateCommunityPostPayload,
  PaginatedResponse,
  ReactionResponse,
} from "@/types/community";

export async function getCommunityPosts(params: {
  group: number;
  game?: number;
  page?: number;
}): Promise<PaginatedResponse<CommunityPost>> {
  const response = await api.get<PaginatedResponse<CommunityPost>>(
    "/community/posts/",
    { params }
  );
  return response.data;
}

export async function createCommunityPost(
  payload: CreateCommunityPostPayload
): Promise<CommunityPost> {
  const formData = new FormData();
  formData.append("group", String(payload.group));
  formData.append("text", payload.text);
  if (payload.game) formData.append("game", String(payload.game));
  if (payload.evidence_id) {
    formData.append("evidence_id", String(payload.evidence_id));
  }
  if (payload.media) formData.append("media", payload.media);

  const response = await api.post<CommunityPost>(
    "/community/posts/",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function deleteCommunityPost(postId: number): Promise<void> {
  await api.delete(`/community/posts/${postId}/`);
}

export async function reactToCommunityPost(
  postId: number,
  reaction_type: CommunityReactionType
): Promise<ReactionResponse> {
  const response = await api.post<ReactionResponse>(
    `/community/posts/${postId}/react/`,
    { reaction_type }
  );
  return response.data;
}

export async function getCommunityComments(
  postId: number
): Promise<PaginatedResponse<CommunityComment>> {
  const response = await api.get<PaginatedResponse<CommunityComment>>(
    "/community/comments/",
    { params: { post: postId, page_size: 30 } }
  );
  return response.data;
}

export async function createCommunityComment(
  post: number,
  text: string
): Promise<CommunityComment> {
  const response = await api.post<CommunityComment>("/community/comments/", {
    post,
    text,
  });
  return response.data;
}

export async function deleteCommunityComment(commentId: number): Promise<void> {
  await api.delete(`/community/comments/${commentId}/`);
}

export async function getCommunityRanking(
  groupId: number,
  gameId: number
): Promise<CommunityRanking> {
  const response = await api.get<CommunityRanking>(
    `/community/groups/${groupId}/ranking/`,
    { params: { game: gameId } }
  );
  return response.data;
}
