import { Response } from 'express';

interface Client {
  res: Response;
  mailboxId: string;
}

class EventBus {
  private clients: Map<string, Client[]> = new Map();

  subscribe(mailboxId: string, res: Response): () => void {
    const client: Client = { res, mailboxId };

    if (!this.clients.has(mailboxId)) {
      this.clients.set(mailboxId, []);
    }
    this.clients.get(mailboxId)!.push(client);

    return () => {
      const list = this.clients.get(mailboxId);
      if (list) {
        const idx = list.indexOf(client);
        if (idx !== -1) list.splice(idx, 1);
        if (list.length === 0) this.clients.delete(mailboxId);
      }
    };
  }

  publish(mailboxId: string, eventName: string, data: unknown): void {
    const clients = this.clients.get(mailboxId);
    if (!clients) return;

    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
      client.res.write(payload);
    }
  }
}

export const eventBus = new EventBus();
