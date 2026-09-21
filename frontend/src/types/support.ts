export type SupportCategory = "ACCESS" | "GAME" | "MENTORSHIP" | "PAYMENT" | "TECHNICAL" | "OTHER";
export type SupportPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type SupportStatus = "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";

export type SupportMessage = {
  id: number;
  author: number | null;
  author_name: string;
  author_is_staff: boolean;
  message: string;
  attachment_available: boolean;
  created_at: string;
};

export type SupportHistory = {
  id: number;
  actor: number | null;
  actor_name: string;
  event: string;
  from_value: string;
  to_value: string;
  created_at: string;
};

export type SupportTicket = {
  id: number;
  protocol: string;
  requester: number;
  requester_name: string;
  category: SupportCategory;
  subject: string;
  priority: SupportPriority;
  status: SupportStatus;
  assignee: number | null;
  assignee_name: string;
  messages: SupportMessage[];
  messages_count: number;
  history: SupportHistory[];
  created_at: string;
  updated_at: string;
  closed_at: string | null;
};

export type SupportFilters = Partial<Pick<SupportTicket, "status" | "priority" | "category" | "assignee">>;
