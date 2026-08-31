import { Router } from 'express';
import { mailboxController } from '../controllers/mailbox.controller.js';
import { mailboxCreationLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/', mailboxCreationLimiter, mailboxController.create);
router.get('/:id', mailboxController.getById);
router.delete('/:id', mailboxController.delete);
router.get('/:id/messages', mailboxController.getMessages);

export default router;
