const MAILBOX_KEY = 'tempMail.mailboxId';

export const storage = {
  getMailboxId(): string | null {
    return localStorage.getItem(MAILBOX_KEY);
  },

  setMailboxId(id: string): void {
    localStorage.setItem(MAILBOX_KEY, id);
  },

  removeMailboxId(): void {
    localStorage.removeItem(MAILBOX_KEY);
  },
};
