import { api } from "@/lib/api";
import { LegalDocument, LegalKind } from "@/types/legal";

export async function getCurrentLegalDocuments() {
  return (await api.get<LegalDocument[]>("/legal/documents/current/")).data;
}

export async function getPendingLegalDocuments() {
  return (await api.get<LegalDocument[]>("/legal/documents/pending/")).data;
}

export async function acceptLegalDocument(id: number) {
  await api.post(`/legal/documents/${id}/accept/`);
}

export async function getAllLegalDocuments() {
  return (await api.get<LegalDocument[]>("/legal/documents/")).data;
}

export async function createLegalDocument(payload: {
  kind: LegalKind;
  version: string;
  title: string;
  body: string;
  requires_acceptance: boolean;
}) {
  return (await api.post<LegalDocument>("/legal/documents/", payload)).data;
}

export async function updateLegalDocument(id: number, payload: {
  kind: LegalKind;
  version: string;
  title: string;
  body: string;
  requires_acceptance: boolean;
}) {
  return (await api.patch<LegalDocument>(`/legal/documents/${id}/`, payload)).data;
}

export async function publishLegalDocument(id: number) {
  return (await api.post<LegalDocument>(`/legal/documents/${id}/publish/`)).data;
}
