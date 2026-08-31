import { Request, Response } from 'express';
import { mailboxService } from '../services/mailbox.service.js';
import { messageService } from '../services/message.service.js';

type IdParam = { id: string };

export const mailboxController = {
  async create(_req: Request, res: Response) {
    try {
      const mailbox = await mailboxService.create();
      res.status(201).json(mailbox);
    } catch (err) {
      console.error('Failed to create mailbox:', err);
      res.status(500).json({ message: 'Failed to create mailbox' });
    }
  },

  async getById(req: Request<IdParam>, res: Response) {
    try {
      const mailbox = await mailboxService.getById(req.params.id);
      if (!mailbox) {
        res.status(404).json({ message: 'Mailbox not found' });
        return;
      }
      res.json(mailbox);
    } catch (err) {
      console.error('Failed to get mailbox:', err);
      res.status(500).json({ message: 'Failed to get mailbox' });
    }
  },

  async delete(req: Request<IdParam>, res: Response) {
    try {
      const deleted = await mailboxService.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: 'Mailbox not found' });
        return;
      }
      res.status(204).send();
    } catch (err) {
      console.error('Failed to delete mailbox:', err);
      res.status(500).json({ message: 'Failed to delete mailbox' });
    }
  },

  async getMessages(req: Request<IdParam>, res: Response) {
    try {
      const mailbox = await mailboxService.getById(req.params.id);
      if (!mailbox) {
        res.status(404).json({ message: 'Mailbox not found' });
        return;
      }
      const messages = await messageService.getByMailboxId(req.params.id);
      res.json(messages);
    } catch (err) {
      console.error('Failed to get messages:', err);
      res.status(500).json({ message: 'Failed to get messages' });
    }
  },
};
