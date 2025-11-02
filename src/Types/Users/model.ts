import pool from "@/src/lib/db";
import { User, CreateUser, UpdateUser, UserFilter, Role, BillingAddress, PaymentMethod, UpdateUserSubscription } from "./type";

export class UserModel {
  constructor(public data: User) {}

  // Helper pour mapper les résultats de la base de données vers un objet User
  private mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password_hash: dbUser.password_hash,
      name: dbUser.name,
      created_at: dbUser.created_at ? new Date(dbUser.created_at) : undefined,
      billing_address: dbUser.billing_address ? JSON.parse(dbUser.billing_address) : undefined,
      payment_method: dbUser.payment_method ? this.mapDbPaymentMethod(JSON.parse(dbUser.payment_method)) : undefined,
      subscription_plan: dbUser.subscription_plan,
      subscription_end_date: dbUser.subscription_end_date ? new Date(dbUser.subscription_end_date) : undefined,
      phone: dbUser.phone,
      company: dbUser.company,
      next_payment_date: dbUser.next_payment_date ? new Date(dbUser.next_payment_date) : undefined,
      subscription_status: dbUser.subscription_status,
      role: dbUser.role
    };
  }

  // Helper pour masquer les numéros de carte
  private mapDbPaymentMethod(paymentMethod: any): PaymentMethod {
    if (paymentMethod?.details?.card_last_four) {
      return {
        ...paymentMethod,
        details: {
          ...paymentMethod.details,
          maskedNumber: `•••• •••• •••• ${paymentMethod.details.card_last_four}`
        }
      };
    }
    return paymentMethod;
  }

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
    return res.rows.map(this.mapDbUserToUser);
  }

  async getUserById(id: number): Promise<User> {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (res.rows.length === 0) {
      throw new Error(`User with id ${id} not found`);
    }
    return this.mapDbUserToUser(res.rows[0]);
  }

  async getUserByEmail(email: string): Promise<User> {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (res.rows.length === 0) {
      throw new Error(`User with email ${email} not found`);
    }
    return this.mapDbUserToUser(res.rows[0]);
  }

  async updateUser(id: number, user: UpdateUser): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = id;

    if (user.email !== undefined) {
      fields.push(`email = $${paramIndex}`);
      values.push(user.email);
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

    if (user.phone !== undefined) {
      fields.push(`phone = $${paramIndex}`);
      values.push(user.phone);
      paramIndex++;
    }

    if (user.company !== undefined) {
      fields.push(`company = $${paramIndex}`);
      values.push(user.company);
      paramIndex++;
    }

    if (user.billing_address !== undefined) {
      fields.push(`billing_address = $${paramIndex}`);
      values.push(user.billing_address ? JSON.stringify(user.billing_address) : null);
      paramIndex++;
    }

    if (user.payment_method !== undefined) {
      fields.push(`payment_method = $${paramIndex}`);
      values.push(user.payment_method ? JSON.stringify(user.payment_method) : null);
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

    if (user.next_payment_date !== undefined) {
      fields.push(`next_payment_date = $${paramIndex}`);
      values.push(user.next_payment_date);
      paramIndex++;
    }

    if (user.subscription_status !== undefined) {
      fields.push(`subscription_status = $${paramIndex}`);
      values.push(user.subscription_status);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.getUserById(id) || Promise.reject(new Error('No fields to update'));
    }

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(id);

    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      throw new Error('User not found');
    }
    return this.mapDbUserToUser(res.rows[0]);
  }

  async createUser(user: Omit<CreateUser, "password"> & {
    password_hash: string;
  }): Promise<User> {
    const res = await pool.query(
      `INSERT INTO users (
        email, password_hash, name, role, phone, company,
        billing_address, payment_method, subscription_plan,
        subscription_end_date, next_payment_date, subscription_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        user.email,
        user.password_hash,
        user.name,
        user.role,
        user.phone,
        user.company,
        user.billing_address ? JSON.stringify(user.billing_address) : null,
        user.payment_method ? JSON.stringify(user.payment_method) : null,
        user.subscription_plan,
        user.subscription_end_date,
        user.next_payment_date,
        user.subscription_status || 'active',
      ]
    );

    return this.mapDbUserToUser(res.rows[0]);
  }

  async deleteUser(id: number): Promise<void> {
    const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    if (res.rows.length === 0) {
      throw new Error('User not found');
    }
  }

  async getUsersBySubscriptionPlan(plan: string): Promise<User[]> {
    const res = await pool.query(
      "SELECT * FROM users WHERE subscription_plan = $1 ORDER BY created_at DESC",
      [plan]
    );
    return res.rows.map(this.mapDbUserToUser);
  }

  async getUsersWithActiveSubscription(): Promise<User[]> {
    const res = await pool.query(
      "SELECT * FROM users WHERE subscription_end_date > NOW() ORDER BY created_at DESC"
    );
    return res.rows.map(this.mapDbUserToUser);
  }

  async updateUserSubscription(id: number, user: UpdateUserSubscription): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = id;

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

    if (user.next_payment_date !== undefined) {
      fields.push(`next_payment_date = $${paramIndex}`);
      values.push(user.next_payment_date);
      paramIndex++;
    }

    if (user.subscription_status !== undefined) {
      fields.push(`subscription_status = $${paramIndex}`);
      values.push(user.subscription_status);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.getUserById(id) || Promise.reject(new Error('No fields to update'));
    }

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(id);

    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      throw new Error('User not found');
    }
    return this.mapDbUserToUser(res.rows[0]);
  }
}
