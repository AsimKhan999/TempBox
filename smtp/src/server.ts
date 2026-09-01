import { SMTPServer, type SMTPServerSession } from 'smtp-server';
import { simpleParser, type ParsedMail } from 'mailparser';
import { config } from './config.js';

interface Delivery {
  from: string;
  to: string[];
  raw: Buffer;
}

async function processDelivery(delivery: Delivery) {
  for (const recipient of delivery.to) {
    const domain = recipient.split('@')[1];

    if (domain !== config.mailDomain) {
      console.log(`[smtp] Rejected: unknown domain ${domain}`);
      continue;
    }

    try {
      const parsed: ParsedMail = await simpleParser(delivery.raw);

      const body = parsed.text || '';
      const html = parsed.html || '';

      const response = await fetch(`${config.backendUrl}/api/inbound/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: delivery.from,
          senderName: parsed.from?.text || delivery.from,
          recipient: recipient,
          subject: parsed.subject || '(No subject)',
          textBody: body,
          htmlBody: html,
        }),
      });

      if (!response.ok) {
        console.error(`[smtp] Failed to store email for ${recipient}: ${response.status}`);
      } else {
        console.log(`[smtp] Email stored for ${recipient}`);
      }
    } catch (err) {
      console.error(`[smtp] Error processing email for ${recipient}:`, err);
    }
  }
}

export function startSmtpServer() {
  const server = new SMTPServer({
    authOptional: true,
    disabledCommands: ['STARTTLS'],
    size: 10 * 1024 * 1024,

    onData(stream: any, session: SMTPServerSession, callback: (err?: Error) => void) {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => {
        const raw = Buffer.concat(chunks);
        const from = session.envelope.mailFrom?.address || '';
        const to = session.envelope.rcptTo.map((r) => r.address);

        processDelivery({ from, to, raw }).catch((err) => {
          console.error('[smtp] Delivery error:', err);
        });

        callback();
      });
    },

    logger: false,
  });

  server.listen(config.smtpPort, () => {
    console.log(`[smtp] SMTP server listening on port ${config.smtpPort}`);
  });

  return server;
}

startSmtpServer();
