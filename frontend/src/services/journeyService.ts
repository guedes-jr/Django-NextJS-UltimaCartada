import { api } from "@/lib/api";
import {
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
