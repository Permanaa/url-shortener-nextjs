export type ShortenMode = 'auto' | 'custom';

export interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  mode: ShortenMode;
  createdAt: number;
  clicks: number;
  hostname: string;
}

export interface ValidationErrors {
  url?: string;
  alias?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
