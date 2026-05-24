import { api } from "@/lib/api";
import { Card, CreateCardPayload, Suit } from "@/types/cards";

export async function getSuits(): Promise<Suit[]> {
  const response = await api.get<Suit[]>("/cards/suits/");

  return response.data;
}

export async function getCards(params?: {
  suit?: number;
  difficulty?: string;
  category?: string;
}): Promise<Card[]> {
  const response = await api.get<Card[]>("/cards/cards/", {
    params,
  });

  return response.data;
}

export async function createCard(payload: CreateCardPayload): Promise<Card> {
  const response = await api.post<Card>("/cards/cards/", payload);

  return response.data;
}
