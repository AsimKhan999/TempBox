import { mailboxRepository, type Mailbox } from '../repositories/mailbox.repository.js';

export interface MailboxResponse {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

function toResponse(mailbox: Mailbox): MailboxResponse {
  return {
    id: mailbox.id,
    email: mailbox.email_address,
    status: mailbox.status,
    createdAt: mailbox.created_at,
    expiresAt: mailbox.expires_at,
  };
}

export const mailboxService = {
  async create(): Promise<MailboxResponse> {
    const mailbox = await mailboxRepository.create();
    return toResponse(mailbox);
  },

  async getById(id: string): Promise<MailboxResponse | null> {
    const mailbox = await mailboxRepository.findById(id);
    if (!mailbox) return null;

    await mailboxRepository.updateLastAccessed(id);

    return toResponse(mailbox);
  },

  async getByEmail(email: string): Promise<Mailbox | null> {
    return mailboxRepository.findByEmail(email);
  },

  async delete(id: string): Promise<boolean> {
    const mailbox = await mailboxRepository.findById(id);
    if (!mailbox) return false;

    await mailboxRepository.markDeleted(id);
    return true;
  },

  async getActiveByDomain(domain: string): Promise<Mailbox[]> {
    const result = await (await import('../config/database.js')).query<Mailbox>(
      `SELECT m.* FROM mailboxes m
       JOIN domains d ON m.domain_id = d.id
       WHERE d.domain = $1 AND m.status = 'ACTIVE' AND m.expires_at > NOW()`,
      [domain]
    );
    return result.rows;
  },
};
