import type { Mailbox, Message } from '../types';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  async createMailbox(): Promise<Mailbox> {
    return request<Mailbox>('/mailboxes', { method: 'POST' });
  },

  async getMailbox(id: string): Promise<Mailbox> {
    return request<Mailbox>(`/mailboxes/${id}`);
  },

  async getMessages(mailboxId: string): Promise<Message[]> {
    return request<Message[]>(`/mailboxes/${mailboxId}/messages`);
  },

  async getMessage(id: string): Promise<Message> {
    return request<Message>(`/messages/${id}`);
  },

  async deleteMailbox(id: string): Promise<void> {
    await request(`/mailboxes/${id}`, { method: 'DELETE' });
  },

  getSSEUrl(mailboxId: string): string {
    return `${API_BASE}/mailboxes/${mailboxId}/events`;
  },
};
