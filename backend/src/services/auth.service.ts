import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { config } from '../config/env.js';

const JWT_EXPIRES_IN = '7d';

export interface User {
  id: string;
  email: string;
  created_at: Date;
}

export async function signup(email: string, password: string): Promise<{ user: User; token: string }> {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('Email already registered');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, password_hash]
  );

  const user = result.rows[0];
  const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: JWT_EXPIRES_IN });

  return { user, token };
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const result = await pool.query('SELECT id, email, password_hash, created_at FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const row = result.rows[0];
  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const user = { id: row.id, email: row.email, created_at: row.created_at };
  const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: JWT_EXPIRES_IN });

  return { user, token };
}

export function verifyToken(token: string): { userId: string; email: string } {
  return jwt.verify(token, config.jwtSecret) as { userId: string; email: string };
}
