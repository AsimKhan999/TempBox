import express from 'express';
import cors from 'cors';
import mailboxRoutes from './routes/mailbox.routes.js';
import messageRoutes from './routes/message.routes.js';
import sseRoutes from './routes/sse.routes.js';
import { messageService } from './services/message.service.js';
import { mailboxService } from './services/mailbox.service.js';
import { apiLimiter, mailboxCreationLimiter } from './middleware/rateLimit.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// SMTP delivery endpoint — called by the SMTP server
app.post('/api/inbound/email', async (req, res) => {
  try {
    const { recipient, sender, senderName, subject, textBody, htmlBody } = req.body;
    if (!recipient || !sender) {
      res.status(400).json({ message: 'Missing recipient or sender' });
      return;
    }

    const localPart = recipient.split('@')[0];
    const mailbox = await mailboxService.getByEmail(recipient);

    if (!mailbox) {
      console.log(`[inbound] Mailbox not found: ${recipient}`);
      res.status(404).json({ message: 'Mailbox not found' });
      return;
    }

    if (mailbox.status !== 'ACTIVE') {
      console.log(`[inbound] Mailbox inactive: ${recipient}`);
      res.status(410).json({ message: 'Mailbox expired' });
      return;
    }

    const msg = await messageService.create({
      mailboxId: mailbox.id,
      sender,
      senderName: senderName || sender,
      recipient,
      subject: subject || '(No subject)',
      textBody: textBody || '',
      htmlBody: htmlBody || '',
    });
    res.json(msg);
  } catch (err) {
    console.error('Inbound email failed:', err);
    res.status(500).json({ message: 'Failed to process email' });
  }
});

// Temporary test endpoint — remove before production
app.post('/api/test/send-email', async (req, res) => {
  try {
    const { mailboxId, sender, subject, textBody, htmlBody } = req.body;
    const msg = await messageService.create({
      mailboxId,
      sender: sender || 'test@example.com',
      senderName: 'Test Sender',
      recipient: 'test@tempbox.com',
      subject: subject || 'Test Email',
      textBody: textBody || 'This is a test email.',
      htmlBody: htmlBody || '<p>This is a <strong>test email</strong>.</p>',
    });
    res.json(msg);
  } catch (err) {
    console.error('Test send failed:', err);
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

app.use('/api/mailboxes', mailboxRoutes);
app.use('/api/mailboxes', sseRoutes);
app.use('/api/messages', messageRoutes);

export default app;
