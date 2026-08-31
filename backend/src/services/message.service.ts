import { messageRepository, type Email, type CreateEmailInput } from '../repositories/message.repository.js';
import { eventBus } from '../events/eventBus.js';
import { sanitizeHtmlContent } from './emailSanitizer.js';

export interface MessageResponse {
  id: string;
  mailboxId: string;
  sender: string;
  senderName: string | null;
  recipient: string;
  subject: string | null;
  textBody: string | null;
  htmlBody: string | null;
  receivedAt: string;
}

function toResponse(email: Email): MessageResponse {
  return {
    id: email.id,
    mailboxId: email.mailbox_id,
    sender: email.sender,
    senderName: email.sender_name,
    recipient: email.recipient,
    subject: email.subject,
    textBody: email.text_body,
    htmlBody: email.html_body,
    receivedAt: email.received_at,
  };
}

export const messageService = {
  async create(input: CreateEmailInput): Promise<MessageResponse> {
    const sanitized: CreateEmailInput = {
      ...input,
      htmlBody: input.htmlBody ? sanitizeHtmlContent(input.htmlBody) : undefined,
    };
    const email = await messageRepository.create(sanitized);
    const response = toResponse(email);
    eventBus.publish(input.mailboxId, 'NEW_EMAIL', response);
    return response;
  },

  async getByMailboxId(mailboxId: string): Promise<MessageResponse[]> {
    const emails = await messageRepository.findByMailboxId(mailboxId);
    return emails.map(toResponse);
  },

  async getById(id: string): Promise<MessageResponse | null> {
    const email = await messageRepository.findById(id);
    if (!email) return null;
    return toResponse(email);
  },

  async deleteByMailboxIds(mailboxIds: string[]): Promise<number> {
    return messageRepository.deleteByMailboxIds(mailboxIds);
  },
};
