export type ProductCode = "GAME" | "MENTORSHIP";

export type ProductEntitlement = {
  id: number;
  user: number;
  username: string;
  user_name: string;
  product: ProductCode;
  is_active: boolean;
  is_current: boolean;
  starts_at: string;
  expires_at: string | null;
  notes: string;
};

export type MentorshipContentType = "VIDEO" | "DOCUMENT" | "LINK";

export type MentorshipContent = {
  id: number;
  module: number;
  title: string;
  description: string;
  content_type: MentorshipContentType;
  order: number;
  video_url: string;
  external_url: string;
  document_available: boolean;
  is_published: boolean;
  is_visible: boolean;
  is_completed: boolean;
};

export type MentorshipModule = {
  id: number;
  program: number;
  title: string;
  description: string;
  order: number;
  is_published: boolean;
  contents: MentorshipContent[];
  contents_count: number;
};

export type MentorshipProgram = {
  id: number;
  title: string;
  description: string;
  is_published: boolean;
  modules: MentorshipModule[];
  modules_count: number;
};
