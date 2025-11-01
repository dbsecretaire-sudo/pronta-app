import pool from "@/app/src/lib/db";
import { User, CreateUser, UpdateUser, UserFilter } from "./type";

export class UserModel {
  constructor(public data: User) {}

  async getAllUsers(filters?: UserFilter): Promise<User[]> {
    let query = "SELECT * FROM users WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.role) {
      query += ` AND role = $${paramIndex}`;
      params.push(filters.role);
      paramIndex++;
    }
    if (filters?.searchTerm) {
      query += ` AND (email ILIKE $${paramIndex} OR name ILIKE $${paramIndex})`;
      params.push(`%${filters.searchTerm}%`);
      paramIndex++;
    }
    if (filters?.subscriptionPlan) {
      query += ` AND subscription_plan = $${paramIndex}`;
      params.push(filters.subscriptionPlan);
      paramIndex++;
    }
    if (filters?.subscriptionActive !== undefined) {
      const operator = filters.subscriptionActive ? '>' : '<=';
      query += ` AND subscription_end_date ${operator} NOW()`;
    }

    query += " ORDER BY created_at DESC";
    const res = await pool.query(query, params);
    return res.rows;
  }

  async getUserById(id: number): Promise<User | null> {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0] || null;
  }

  async createUser(user: Omit<CreateUser, "password"> & { password_hash: string }): Promise<User> {
    const res = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, billing_address, payment_method, subscription_plan, subscription_end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user.email,
        user.password_hash,
        user.name,
        user.role,
        user.billing_address,
        user.payment_method,
        user.subscription_plan,
        user.subscription_end_date,
      ]
    );
    return res.rows[0];
  }

  async updateUser(id: number, user: UpdateUser & { password_hash?: string }): Promise<User> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (user.email !== undefined) {
      fields.push(`email = $${paramIndex}`);
      values.push(user.email);
      paramIndex++;
    }
    if (user.password_hash !== undefined) {
      fields.push(`password_hash = $${paramIndex}`);
      values.push(user.password_hash);
      paramIndex++;
    }
    if (user.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(user.name);
      paramIndex++;
    }
    if (user.role !== undefined) {
      fields.push(`role = $${paramIndex}`);
      values.push(user.role);
      paramIndex++;
    }
    if (user.billing_address !== undefined) {
      fields.push(`billing_address = $${paramIndex}`);
      values.push(user.billing_address);
      paramIndex++;
    }
    if (user.payment_method !== undefined) {
      fields.push(`payment_method = $${paramIndex}`);
      values.push(user.payment_method);
      paramIndex++;
    }
    if (user.subscription_plan !== undefined) {
      fields.push(`subscription_plan = $${paramIndex}`);
      values.push(user.subscription_plan);
      paramIndex++;
    }
    if (user.subscription_end_date !== undefined) {
      fields.push(`subscription_end_date = $${paramIndex}`);
      values.push(user.subscription_end_date);
      paramIndex++;
    }

    const res = await pool.query(
      `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
      [...values, id]
    );
    return res.rows[0];
  }

  async deleteUser(id: number): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    // La suppression en cascade est gérée par la base pour:
    // - clients
    // - invoices
    // - user_services
    // - calendar_events
    // - calls
  }

  async getUsersBySubscriptionPlan(plan: string): Promise<User[]> {
    const res = await pool.query(
      "SELECT * FROM users WHERE subscription_plan = $1 ORDER BY created_at DESC",
      [plan]
    );
    return res.rows;
  }

  async getUsersWithActiveSubscription(): Promise<User[]> {
    const res = await pool.query(
      "SELECT * FROM users WHERE subscription_end_date > NOW() ORDER BY created_at DESC"
    );
    return res.rows;
  }
}
