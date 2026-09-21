import { api } from "@/lib/api";
import {
  MentorshipContent,
  MentorshipContentType,
  MentorshipModule,
  MentorshipProgram,
  ProductEntitlement,
} from "@/types/mentorship";

export async function getMentorshipPrograms() {
  const response = await api.get<MentorshipProgram[]>("/mentorship/programs/");
  return response.data;
}

export async function getMentorshipModules() {
  const response = await api.get<MentorshipModule[]>("/mentorship/modules/");
  return response.data;
}

export async function getMentorshipContents() {
  const response = await api.get<MentorshipContent[]>("/mentorship/contents/");
  return response.data;
}

export async function createMentorshipProgram(payload: { title: string; description: string; is_published: boolean }) {
  return (await api.post<MentorshipProgram>("/mentorship/programs/", payload)).data;
}

export async function updateMentorshipProgram(id: number, payload: Partial<{ title: string; description: string; is_published: boolean }>) {
  return (await api.patch<MentorshipProgram>(`/mentorship/programs/${id}/`, payload)).data;
}

export async function createMentorshipModule(payload: { program: number; title: string; description: string; order: number; is_published: boolean }) {
  return (await api.post<MentorshipModule>("/mentorship/modules/", payload)).data;
}

export async function updateMentorshipModule(id: number, payload: Partial<{ title: string; description: string; order: number; is_published: boolean }>) {
  return (await api.patch<MentorshipModule>(`/mentorship/modules/${id}/`, payload)).data;
}

export async function createMentorshipContent(payload: {
  module: number; title: string; description: string; content_type: MentorshipContentType;
  order: number; video_url: string; external_url: string; document?: File | null;
  is_published: boolean; is_visible: boolean;
}) {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) data.append(key, value);
    else if (value !== null && value !== undefined) data.append(key, String(value));
  });
  return (await api.post<MentorshipContent>("/mentorship/contents/", data)).data;
}

export async function updateMentorshipContent(id: number, payload: Partial<{
  title: string; description: string; order: number; video_url: string; external_url: string;
  document: File; is_published: boolean; is_visible: boolean;
}>) {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => data.append(key, value instanceof File ? value : String(value)));
  return (await api.patch<MentorshipContent>(`/mentorship/contents/${id}/`, data)).data;
}

export async function completeMentorshipContent(id: number) {
  await api.post(`/mentorship/contents/${id}/complete/`);
}

export async function downloadMentorshipDocument(content: MentorshipContent) {
  const response = await api.get<Blob>(`/mentorship/contents/${content.id}/download/`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = content.title;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function getEntitlements() {
  return (await api.get<ProductEntitlement[]>("/entitlements/entitlements/")).data;
}

export async function createEntitlement(user: number, product: "GAME" | "MENTORSHIP") {
  return (await api.post<ProductEntitlement>("/entitlements/entitlements/", { user, product, is_active: true })).data;
}

export async function setEntitlementActive(id: number, active: boolean) {
  return (await api.post<ProductEntitlement>(`/entitlements/entitlements/${id}/${active ? "activate" : "revoke"}/`)).data;
}
