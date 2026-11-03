export const messageStatuses = ["new", "in_progress", "replied", "closed", "spam"] as const;
export type MessageStatus = (typeof messageStatuses)[number];

export const statusLabels: Record<MessageStatus, string> = {
  new: "New",
  in_progress: "In progress",
  replied: "Replied",
  closed: "Closed",
  spam: "Spam",
};

export type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: MessageStatus;
  note: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaItem = {
  id: number;
  fileName: string;
  originalName: string;
  mime: string;
  size: number;
  url: string;
  alt: string;
  createdAt: string;
};

export type IconResult = { name: string; source: string; viewBox: string; body: string; mode: "fill" | "stroke" };
