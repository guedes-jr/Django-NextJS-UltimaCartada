export type Notification = {
  id: number;
  title: string;
  message: string;
  category: string;
  link: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};
