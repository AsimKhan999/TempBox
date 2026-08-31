import { query } from '../config/database.js';
import { config } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';

export interface Mailbox {
  id: string;
  email_address: string;
  domain_id: number;
  status: string;
  created_at: string;
  expires_at: string;
  last_accessed_at: string;
}

function generateLocalPart(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const mailboxRepository = {
  async create(): Promise<Mailbox> {
    const id = uuidv4();
    const localPart = generateLocalPart();
    const email = `${localPart}@${config.mailDomain}`;
    const ttlMs = config.mailboxTtlMinutes * 60 * 1000;
    const expiresAt = new Date(Date.now() + ttlMs).toISOString();

    const result = await query<Mailbox>(
      `INSERT INTO mailboxes (id, email_address, domain_id, status, created_at, expires_at)
       SELECT $1, $2, d.id, 'ACTIVE', NOW(), $3
       FROM domains d WHERE d.domain = $4 AND d.is_active = true
       RETURNING *`,
      [id, email, expiresAt, config.mailDomain]
    );

    if (result.rows.length === 0) {
      throw new Error(`Domain ${config.mailDomain} not found or inactive`);
    }

    return result.rows[0];
  },

  async findById(id: string): Promise<Mailbox | null> {
    const result = await query<Mailbox>(
      'SELECT * FROM mailboxes WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async findByEmail(email: string): Promise<Mailbox | null> {
    const result = await query<Mailbox>(
      'SELECT * FROM mailboxes WHERE email_address = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  async updateLastAccessed(id: string): Promise<void> {
    await query(
      'UPDATE mailboxes SET last_accessed_at = NOW() WHERE id = $1',
      [id]
    );
  },

  async markExpired(id: string): Promise<void> {
    await query(
      "UPDATE mailboxes SET status = 'EXPIRED' WHERE id = $1",
      [id]
    );
  },

  async markDeleted(id: string): Promise<void> {
    await query(
      "UPDATE mailboxes SET status = 'DELETED' WHERE id = $1",
      [id]
    );
  },

  async deleteExpired(): Promise<string[]> {
    const result = await query<{ id: string }>(
      "UPDATE mailboxes SET status = 'EXPIRED' WHERE status = 'ACTIVE' AND expires_at < NOW() RETURNING id"
    );
    return result.rows.map((r) => r.id);
  },
};
