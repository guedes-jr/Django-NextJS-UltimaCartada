export type LegalKind = "TERMS" | "PRIVACY";

export type LegalDocument = {
  id: number;
  kind: LegalKind;
  version: string;
  title: string;
  body: string;
  is_published: boolean;
  requires_acceptance: boolean;
  published_at: string | null;
};
