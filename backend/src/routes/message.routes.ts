import { Router } from 'express';
import { messageController } from '../controllers/message.controller.js';

const router = Router();

router.get('/:id', messageController.getById);

export default router;
