import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { saveMailbox, unsaveMailbox, getSavedMailboxes, getSavedMailboxEmails, getAllSavedEmails } from '../services/savedMailbox.service.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const saved = await getSavedMailboxes(req.userId!);
    res.json(saved);
  } catch {
    res.status(500).json({ error: 'Failed to fetch saved mailboxes' });
  }
});

router.post('/:mailboxId', async (req: AuthRequest, res: Response) => {
  try {
    const mailboxId = req.params.mailboxId as string;
    const saved = await saveMailbox(req.userId!, mailboxId, req.body.label);
    res.status(201).json(saved);
  } catch (err: any) {
    if (err.message === 'Mailbox not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to save mailbox' });
  }
});

router.delete('/:mailboxId', async (req: AuthRequest, res: Response) => {
  try {
    const mailboxId = req.params.mailboxId as string;
    await unsaveMailbox(req.userId!, mailboxId);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to unsave mailbox' });
  }
});

router.get('/:mailboxId/emails', async (req: AuthRequest, res: Response) => {
  try {
    const mailboxId = req.params.mailboxId as string;
    const emails = await getSavedMailboxEmails(req.userId!, mailboxId);
    res.json(emails);
  } catch (err: any) {
    if (err.message === 'Not found') {
      return res.status(404).json({ error: 'Mailbox not found or not saved' });
    }
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

router.get('/all/emails', async (req: AuthRequest, res: Response) => {
  try {
    const emails = await getAllSavedEmails(req.userId!);
    res.json(emails);
  } catch {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

export default router;
