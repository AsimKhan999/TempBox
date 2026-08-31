export interface Mailbox {
  id: string;
  email: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DELETED';
  createdAt: string;
  expiresAt: string;
}

export interface Message {
  id: string;
  mailboxId: string;
  sender: string;
  senderName: string;
  recipient: string;
  subject: string;
  textBody: string;
  htmlBody: string;
  receivedAt: string;
}

export interface MailboxState {
  mailbox: Mailbox | null;
  messages: Message[];
  selectedMessage: Message | null;
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export type MailboxAction =
  | { type: 'SET_MAILBOX'; payload: Mailbox }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_SELECTED_MESSAGE'; payload: Message | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'RESET' };
