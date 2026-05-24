import { api } from "@/lib/api";
import { CreateEvidencePayload, Evidence } from "@/types/evidences";

export async function getEvidences(): Promise<Evidence[]> {
  const response = await api.get<Evidence[]>("/evidences/evidences/");

  return response.data;
}

export async function createEvidence(
  payload: CreateEvidencePayload
): Promise<Evidence> {
  const formData = new FormData();

  formData.append("play", String(payload.play));
  formData.append("text", payload.text);

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post<Evidence>("/evidences/evidences/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
