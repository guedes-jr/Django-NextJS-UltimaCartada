export type AuditEvent = {
  id: number;
  actor: number | null;
  actor_name: string;
  action: string;
  resource: string;
  object_id: string;
  path: string;
  method: string;
  status_code: number;
  changes: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string;
  request_id: string;
  created_at: string;
};

export type AuditFilters = {
  actor?: number;
  action?: string;
  resource?: string;
  start_date?: string;
  end_date?: string;
};
