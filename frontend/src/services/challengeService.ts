import { api } from "@/lib/api";
import {
  ChallengeRankingEntry,
  CreateFlashChallengePayload,
  FlashChallenge,
  FlashChallengeSubmission,
} from "@/types/challenges";

export async function getFlashChallenges() {
  const response = await api.get<FlashChallenge[]>("/challenges/challenges/");
  return response.data;
}

export async function createFlashChallenge(payload: CreateFlashChallengePayload) {
  const response = await api.post<FlashChallenge>("/challenges/challenges/", payload);
  return response.data;
}

export async function publishFlashChallenge(id: number) {
  const response = await api.post<FlashChallenge>(`/challenges/challenges/${id}/publish/`);
  return response.data;
}

export async function cancelFlashChallenge(id: number) {
  const response = await api.post<FlashChallenge>(`/challenges/challenges/${id}/cancel/`);
  return response.data;
}

export async function getChallengeSubmissions() {
  const response = await api.get<FlashChallengeSubmission[]>("/challenges/submissions/");
  return response.data;
}

export async function getChallengeRanking(id: number) {
  const response = await api.get<ChallengeRankingEntry[]>(
    `/challenges/challenges/${id}/ranking/`
  );
  return response.data;
}

export async function submitFlashChallenge(payload: {
  challenge: number;
  group: number;
  text: string;
  file?: File | null;
}) {
  const data = new FormData();
  data.append("challenge", String(payload.challenge));
  data.append("group", String(payload.group));
  data.append("text", payload.text);
  if (payload.file) data.append("file", payload.file);
  const response = await api.post<FlashChallengeSubmission>("/challenges/submissions/", data);
  return response.data;
}

export async function reviewChallengeSubmission(
  id: number,
  decision: "approve" | "reject",
  review_notes: string
) {
  const response = await api.post<FlashChallengeSubmission>(
    `/challenges/submissions/${id}/${decision}/`,
    { review_notes }
  );
  return response.data;
}
