import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export interface Email {
  id: string;
  mailbox_id: string;
  sender: string;
  sender_name: string | null;
  recipient: string;
  subject: string | null;
  text_body: string | null;
  html_body: string | null;
  received_at: string;
}

export interface CreateEmailInput {
  mailboxId: string;
  sender: string;
  senderName?: string;
  recipient: string;
  subject?: string;
  textBody?: string;
  htmlBody?: string;
}

export const messageRepository = {
  async create(input: CreateEmailInput): Promise<Email> {
    const id = uuidv4();
    const result = await query<Email>(
      `INSERT INTO emails (id, mailbox_id, sender, sender_name, recipient, subject, text_body, html_body)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        id,
        input.mailboxId,
        input.sender,
        input.senderName || null,
        input.recipient,
        input.subject || null,
        input.textBody || null,
        input.htmlBody || null,
      ]
    );
    return result.rows[0];
  },

  async findByMailboxId(mailboxId: string): Promise<Email[]> {
    const result = await query<Email>(
      'SELECT * FROM emails WHERE mailbox_id = $1 ORDER BY received_at DESC',
      [mailboxId]
    );
    return result.rows;
  },

  async findById(id: string): Promise<Email | null> {
    const result = await query<Email>(
      'SELECT * FROM emails WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async deleteByMailboxIds(mailboxIds: string[]): Promise<number> {
    if (mailboxIds.length === 0) return 0;
    const result = await query(
      `DELETE FROM emails WHERE mailbox_id = ANY($1)`,
      [mailboxIds]
    );
    return result.rowCount ?? 0;
  },
};
