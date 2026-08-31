import app from './app.js';
import { config } from './config/env.js';
import { pool } from './config/database.js';
import { migrate } from './db/migrate.js';
import { startCleanupScheduler } from './jobs/cleanup.js';

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  try {
    await migrate();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }

  try {
    await startCleanupScheduler();
  } catch (err) {
    console.error('Cleanup scheduler failed to start:', err);
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

start();
