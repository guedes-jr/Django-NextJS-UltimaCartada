import { api } from "@/lib/api";
import {
  JourneyDay,
  JourneyDayPayload,
  DailyJourneyProgress,
  DailyGroupPillar,
  DailyParticipation,
  CreateJourneyPayload,
  EnrollGroupsPayload,
  EnrollGroupsResponse,
  Journey,
  JourneyEnrollment,
} from "@/types/journeys";

export async function getJourneys(): Promise<Journey[]> {
  const response = await api.get<Journey[]>("/journeys/journeys/");
  return response.data;
}

export async function createJourney(
  payload: CreateJourneyPayload
): Promise<Journey> {
  const response = await api.post<Journey>("/journeys/journeys/", payload);
  return response.data;
}

export async function enrollJourneyGroups(
  journeyId: number,
  payload: EnrollGroupsPayload
): Promise<EnrollGroupsResponse> {
  const response = await api.post<EnrollGroupsResponse>(
    `/journeys/journeys/${journeyId}/enroll-groups/`,
    payload
  );
  return response.data;
}

export async function getJourneyProgress(
  journeyId: number
): Promise<JourneyEnrollment[]> {
  const response = await api.get<JourneyEnrollment[]>(
    `/journeys/journeys/${journeyId}/progress/`
  );
  return response.data;
}

export async function getJourneyEnrollments(): Promise<JourneyEnrollment[]> {
  const response = await api.get<JourneyEnrollment[]>(
    "/journeys/enrollments/"
  );
  return response.data;
}

export async function getJourneyDays(journeyId: number) {
  return (await api.get<JourneyDay[]>("/journeys/days/", { params: { journey: journeyId } })).data;
}

export async function saveJourneyDay(payload: JourneyDayPayload, id?: number, image?: File | null) {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => data.append(key, String(value)));
  if (image) data.append("image", image);
  const response = id
    ? await api.patch<JourneyDay>(`/journeys/days/${id}/`, data)
    : await api.post<JourneyDay>("/journeys/days/", data);
  return response.data;
}

export async function getDailyJourneys() {
  return (await api.get<DailyJourneyProgress[]>("/journeys/enrollments/daily/")).data;
}

export async function recordDailyIntention(enrollment: number, day: number, text: string) {
  return (await api.post<DailyParticipation>(`/journeys/enrollments/${enrollment}/intention/`, { day, text })).data;
}

export async function submitDailyEvidence(enrollment: number, day: number, text: string, file?: File | null) {
  const data = new FormData();
  data.append("day", String(day));
  data.append("text", text);
  if (file) data.append("file", file);
  return (await api.post<DailyParticipation>(`/journeys/enrollments/${enrollment}/evidence/`, data)).data;
}

export async function downloadDailyEvidence(id: number) {
  const response = await api.get<Blob>(`/journeys/participations/${id}/download/`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `evidencia-cartada-${id}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function updateJourneyStatus(id: number, status: "DRAFT" | "ACTIVE") {
  return (await api.patch<Journey>(`/journeys/journeys/${id}/`, { status })).data;
}

export async function enableDailyJourney(id: number) {
  return (await api.patch<Journey>(`/journeys/journeys/${id}/`, { daily_enabled: true })).data;
}

export async function getDailyGroupSummary(enrollment: number) {
  return (await api.get<DailyGroupPillar[]>(`/journeys/enrollments/${enrollment}/daily-summary/`)).data;
}
