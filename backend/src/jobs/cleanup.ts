import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../config/env.js';
import { query } from '../config/database.js';

const connection = new IORedis(config.redisUrl, { maxRetriesPerRequest: null });

export const cleanupQueue = new Queue('cleanup', { connection });

const WORKER_CONCURRENCY = 1;

async function expireMailboxes() {
  const result = await query<{ id: string }>(
    "UPDATE mailboxes SET status = 'EXPIRED' WHERE status = 'ACTIVE' AND expires_at < NOW() RETURNING id"
  );
  const expiredIds = result.rows.map((r) => r.id);

  if (expiredIds.length === 0) return;

  await query('DELETE FROM emails WHERE mailbox_id = ANY($1)', [expiredIds]);
  console.log(`[cleanup] Expired ${expiredIds.length} mailboxes and their messages`);
}

async function cleanupOldExpired() {
  const result = await query<{ id: string }>(
    "DELETE FROM mailboxes WHERE status IN ('EXPIRED', 'DELETED') AND expires_at < NOW() - INTERVAL '1 hour' RETURNING id"
  );
  if (result.rows.length > 0) {
    console.log(`[cleanup] Removed ${result.rows.length} old expired/deleted mailboxes`);
  }
}

const worker = new Worker(
  'cleanup',
  async (job) => {
    switch (job.name) {
      case 'expire-mailboxes':
        await expireMailboxes();
        break;
      case 'cleanup-old':
        await cleanupOldExpired();
        break;
    }
  },
  { connection, concurrency: WORKER_CONCURRENCY }
);

worker.on('failed', (job, err) => {
  console.error(`[cleanup] Job ${job?.name} failed:`, err.message);
});

export async function startCleanupScheduler() {
  await cleanupQueue.upsertJobScheduler(
    'expire-mailboxes',
    { every: 60 * 1000 },
    { name: 'expire-mailboxes', data: {} }
  );

  await cleanupQueue.upsertJobScheduler(
    'cleanup-old',
    { every: 10 * 60 * 1000 },
    { name: 'cleanup-old', data: {} }
  );

  console.log('[cleanup] Scheduler started');
}

export async function stopCleanupScheduler() {
  await worker.close();
  await cleanupQueue.close();
  await connection.quit();
}
