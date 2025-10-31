import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { User } from '@/Types/Users/index';
import { LoginCredentials } from './types';

export async function authenticateUser(credentials: LoginCredentials): Promise<User | null> {
  const query = 'SELECT id, email, password_hash, name, role FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [credentials.email]);

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0] as User;
  const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);

  return passwordMatch ? user : null;
}