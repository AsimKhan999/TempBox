const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Signup failed');
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  return res.json();
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export interface SavedMailbox {
  id: string;
  user_id: string;
  mailbox_id: string;
  email_address: string;
  label: string | null;
  created_at: string;
}

export async function getSavedMailboxes(token: string): Promise<SavedMailbox[]> {
  const res = await fetch(`${API_URL}/saved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function saveMailbox(token: string, mailboxId: string, label?: string): Promise<SavedMailbox> {
  const res = await fetch(`${API_URL}/saved/${mailboxId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}

export async function unsaveMailbox(token: string, mailboxId: string): Promise<void> {
  await fetch(`${API_URL}/saved/${mailboxId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
