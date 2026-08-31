import { Router, Request, Response } from 'express';
import { eventBus } from '../events/eventBus.js';

const router = Router();

router.get('/:id/events', (req: Request<{ id: string }>, res: Response) => {
  const mailboxId = req.params.id;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write(`:ok\n\n`);

  const unsubscribe = eventBus.subscribe(mailboxId, res);

  req.on('close', () => {
    unsubscribe();
  });
});

export default router;
