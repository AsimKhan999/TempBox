import { Request, Response } from 'express';
import { messageService } from '../services/message.service.js';

type IdParam = { id: string };

export const messageController = {
  async getById(req: Request<IdParam>, res: Response) {
    try {
      const message = await messageService.getById(req.params.id);
      if (!message) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }
      res.json(message);
    } catch (err) {
      console.error('Failed to get message:', err);
      res.status(500).json({ message: 'Failed to get message' });
    }
  },
};
