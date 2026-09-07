import { pool } from '../config/database.js';

export interface SavedMailbox {
  id: string;
  user_id: string;
  mailbox_id: string;
  email_address: string;
  label: string | null;
  created_at: Date;
}

export async function saveMailbox(userId: string, mailboxId: string, label?: string): Promise<SavedMailbox> {
  const mailbox = await pool.query('SELECT id FROM mailboxes WHERE id = $1', [mailboxId]);
  if (mailbox.rows.length === 0) {
    throw new Error('Mailbox not found');
  }

  const result = await pool.query(
    `INSERT INTO saved_mailboxes (user_id, mailbox_id, label)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, mailbox_id) DO UPDATE SET label = $3
     RETURNING id, user_id, mailbox_id, label, created_at`,
    [userId, mailboxId, label || null]
  );

  const saved = result.rows[0];
  const emailResult = await pool.query('SELECT email_address FROM mailboxes WHERE id = $1', [mailboxId]);
  saved.email_address = emailResult.rows[0].email_address;

  return saved;
}

export async function unsaveMailbox(userId: string, mailboxId: string): Promise<void> {
  await pool.query('DELETE FROM saved_mailboxes WHERE user_id = $1 AND mailbox_id = $2', [userId, mailboxId]);
}

export async function getSavedMailboxes(userId: string): Promise<SavedMailbox[]> {
  const result = await pool.query(
    `SELECT sm.id, sm.user_id, sm.mailbox_id, sm.label, sm.created_at, m.email_address
     FROM saved_mailboxes sm
     JOIN mailboxes m ON m.id = sm.mailbox_id
     WHERE sm.user_id = $1
     ORDER BY sm.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function getSavedMailboxEmails(userId: string, mailboxId: string) {
  const check = await pool.query(
    'SELECT id FROM saved_mailboxes WHERE user_id = $1 AND mailbox_id = $2',
    [userId, mailboxId]
  );
  if (check.rows.length === 0) {
    throw new Error('Not found');
  }

  const result = await pool.query(
    `SELECT id, sender, sender_name, recipient, subject, text_body, html_body, received_at
     FROM emails
     WHERE mailbox_id = $1
     ORDER BY received_at DESC`,
    [mailboxId]
  );
  return result.rows;
}

export async function getAllSavedEmails(userId: string) {
  const result = await pool.query(
    `SELECT e.id, e.sender, e.sender_name, e.recipient, e.subject, e.text_body, e.html_body, e.received_at,
            m.email_address as mailbox_email
     FROM emails e
     JOIN saved_mailboxes sm ON sm.mailbox_id = e.mailbox_id
     JOIN mailboxes m ON m.id = e.mailbox_id
     WHERE sm.user_id = $1
     ORDER BY e.received_at DESC`,
    [userId]
  );
  return result.rows;
}
