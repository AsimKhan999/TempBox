import { pool } from '../config/database.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS domains (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS mailboxes (
  id UUID PRIMARY KEY,
  email_address VARCHAR(255) NOT NULL UNIQUE,
  domain_id INTEGER NOT NULL REFERENCES domains(id),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_mailboxes_email ON mailboxes(email_address);
CREATE INDEX IF NOT EXISTS idx_mailboxes_expires ON mailboxes(expires_at);
CREATE INDEX IF NOT EXISTS idx_mailboxes_status ON mailboxes(status);

CREATE TABLE IF NOT EXISTS saved_mailboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mailbox_id UUID NOT NULL REFERENCES mailboxes(id) ON DELETE CASCADE,
  label VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, mailbox_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_mailboxes_user ON saved_mailboxes(user_id);

CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY,
  mailbox_id UUID NOT NULL REFERENCES mailboxes(id) ON DELETE CASCADE,
  sender VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  recipient VARCHAR(255) NOT NULL,
  subject TEXT,
  text_body TEXT,
  html_body TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emails_mailbox ON emails(mailbox_id);
CREATE INDEX IF NOT EXISTS idx_emails_received ON emails(received_at);

CREATE TABLE IF NOT EXISTS email_headers (
  id SERIAL PRIMARY KEY,
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  header_name VARCHAR(255) NOT NULL,
  header_value TEXT
);

CREATE INDEX IF NOT EXISTS idx_email_headers_email ON email_headers(email_id);
`;

const ALTERS = [
  `ALTER TABLE mailboxes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
  `CREATE INDEX IF NOT EXISTS idx_mailboxes_user ON mailboxes(user_id)`,
];

export async function migrate() {
  console.log('Running database migration...');
  await pool.query(SCHEMA);

  for (const sql of ALTERS) {
    await pool.query(sql);
  }

  const defaultDomain = process.env.MAIL_DOMAIN || 'tempbox.dev';
  await pool.query(
    `INSERT INTO domains (domain, is_active) VALUES ($1, true)
     ON CONFLICT (domain) DO NOTHING`,
    [defaultDomain]
  );

  console.log('Migration complete.');
}

if (process.argv[1]?.endsWith('migrate.ts') || process.argv[1]?.endsWith('migrate.js')) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
