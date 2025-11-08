import pool from "@/src/lib/db";
import {
  Subscription,
  CreateSubscription,
  UpdateSubscription,
  SubscriptionWithService,
  SubscriptionStatus,
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionSchema,
  formatDateForDB,
  parseDateFromDB,
  validateCreateSubscription,
  validateUpdateSubscription
} from "@/src/lib/schemas/subscription";
import { User } from "../Users";

export class SubscriptionModel {
  /**
   * Crée un nouvel abonnement
   */
  async createSubscription(subscriptionData: unknown): Promise<Subscription> {
    const validatedData = validateCreateSubscription(subscriptionData);

    const query = `
      INSERT INTO user_subscriptions (
        user_id, service_id, status, start_date, end_date, next_payment_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      validatedData.user_id,
      validatedData.service_id,
      validatedData.status || 'active',
      formatDateForDB(validatedData.start_date),
      formatDateForDB(validatedData.end_date),
      formatDateForDB(validatedData.next_payment_date)
    ]);

    if (rows.length === 0) {
      throw new Error("Failed to create subscription");
    }

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  /**
   * Met à jour un abonnement existant
   */
  async updateSubscription(id: number, subscriptionData: unknown): Promise<Subscription> {
    const validatedData = validateUpdateSubscription(subscriptionData);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validatedData.service_id !== undefined) {
      fields.push(`service_id = $${paramIndex}`);
      values.push(validatedData.service_id);
      paramIndex++;
    }
    if (validatedData.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(validatedData.status);
      paramIndex++;
    }
    if (validatedData.start_date !== undefined) {
      fields.push(`start_date = $${paramIndex}`);
      values.push(formatDateForDB(validatedData.start_date));
      paramIndex++;
    }
    if (validatedData.end_date !== undefined) {
      fields.push(`end_date = $${paramIndex}`);
      values.push(formatDateForDB(validatedData.end_date));
      paramIndex++;
    }
    if (validatedData.next_payment_date !== undefined) {
      fields.push(`next_payment_date = $${paramIndex}`);
      values.push(formatDateForDB(validatedData.next_payment_date));
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const updateQuery = `
      UPDATE user_subscriptions
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    values.push(id);

    const { rows } = await pool.query(updateQuery, values);

    if (rows.length === 0) {
      throw new Error('Subscription not found');
    }

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  /**
   * Récupère un utilisateur avec ses abonnements
   */
  async getUserWithSubscriptions(userId: number): Promise<User & { subscriptions: Subscription[] }> {
    // Vérifie que l'utilisateur existe
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const { rows: userRows } = await pool.query(userQuery, [userId]);

    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    // Récupère les abonnements
    const subscriptionsQuery = `
      SELECT * FROM user_subscriptions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const { rows: subscriptionRows } = await pool.query(subscriptionsQuery, [userId]);

    return {
      ...this.mapDbUserToUser(userRows[0]),
      subscriptions: subscriptionRows.map(row => this.mapDbSubscriptionToSubscription(row))
    };
  }

  /**
   * Récupère un abonnement par son ID
   */
  async getSubscriptionById(subscriptionId: number): Promise<Subscription> {
    const query = 'SELECT * FROM user_subscriptions WHERE id = $1';
    const { rows } = await pool.query(query, [subscriptionId]);

    if (rows.length === 0) {
      throw new Error('Subscription not found');
    }

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  /**
   * Récupère les abonnements d'un utilisateur avec les détails des services
   */
  async getSubscriptionByUserId(userId: number): Promise<SubscriptionWithService[]> {
    const query = `
      SELECT
        user_subscriptions.*,
        services.name AS service_name,
        services.price AS service_price,
        services.unit AS service_unit,
        services.route AS service_route,
        services.icon AS service_icon,
        services.description AS service_description,
        services.is_active AS service_is_active
      FROM user_subscriptions
      JOIN services ON user_subscriptions.service_id = services.id
      WHERE user_subscriptions.user_id = $1
      ORDER BY user_subscriptions.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows.map(row => this.mapDbSubscriptionToSubscriptionWithService(row));
  }

  /**
   * Récupère un abonnement spécifique pour un utilisateur et un service
   */
  async getSubscriptionByUserIdAndService(userId: number, serviceId: number): Promise<Subscription | null> {
    const query = `
      SELECT * FROM user_subscriptions
      WHERE user_id = $1 AND service_id = $2
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [userId, serviceId]);

    if (rows.length === 0) {
      return null;
    }

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  /**
   * Récupère tous les abonnements
   */
  async getAllSubscriptions(): Promise<Subscription[]> {
    const { rows } = await pool.query(`
      SELECT * FROM user_subscriptions
      ORDER BY created_at DESC
    `);

    return rows.map(row => this.mapDbSubscriptionToSubscription(row));
  }

  /**
   * Crée un abonnement pour un utilisateur spécifique
   */
  async createUserSubscription(userId: number, subscriptionData: CreateSubscription): Promise<Subscription> {
    // Vérifie que l'utilisateur existe
    const { rows: userRows } = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userRows.length === 0) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Valide les données avec le schéma
    const validatedData = CreateSubscriptionSchema.parse({
      ...subscriptionData,
      user_id: userId
    });

    const query = `
      INSERT INTO user_subscriptions (
        user_id, service_id, status, start_date, end_date, next_payment_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      validatedData.user_id,
      validatedData.service_id,
      validatedData.status || 'active',
      formatDateForDB(validatedData.start_date),
      formatDateForDB(validatedData.end_date),
      formatDateForDB(validatedData.next_payment_date)
    ]);

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  /**
   * Supprime un abonnement
   */
  async deleteUserSubscription(subscriptionId: number): Promise<void> {
    // Vérifie que l'abonnement existe
    const { rows } = await pool.query(
      'SELECT id FROM user_subscriptions WHERE id = $1',
      [subscriptionId]
    );

    if (rows.length === 0) {
      throw new Error(`Subscription with id ${subscriptionId} not found`);
    }

    await pool.query(`
      DELETE FROM user_subscriptions
      WHERE id = $1
    `, [subscriptionId]);
  }

  /**
   * Mappe une ligne de la base de données à un objet Subscription
   */
  private mapDbSubscriptionToSubscription(dbSubscription: any): Subscription {
    return SubscriptionSchema.parse({
      id: dbSubscription.id,
      user_id: dbSubscription.user_id,
      service_id: dbSubscription.service_id,
      status: dbSubscription.status,
      start_date: parseDateFromDB(dbSubscription.start_date),
      end_date: parseDateFromDB(dbSubscription.end_date),
      next_payment_date: parseDateFromDB(dbSubscription.next_payment_date),
      created_at: parseDateFromDB(dbSubscription.created_at),
      updated_at: parseDateFromDB(dbSubscription.updated_at)
    });
  }

  /**
   * Mappe une ligne de la base de données à un objet User
   */
  private mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password_hash: dbUser.password_hash,
      name: dbUser.name || undefined,
      created_at: dbUser.created_at ? new Date(dbUser.created_at) : undefined,
      billing_address: dbUser.billing_address ? JSON.parse(dbUser.billing_address) : undefined,
      payment_method: dbUser.payment_method ? JSON.parse(dbUser.payment_method) : undefined,
      phone: dbUser.phone || undefined,
      company: dbUser.company || undefined,
      role: dbUser.role,
      can_write: dbUser.can_write,
      can_delete: dbUser.can_delete,
      service_ids: dbUser.service_ids,
    };
  }

  /**
   * Mappe une ligne de la base de données à un objet SubscriptionWithService
   */
  private mapDbSubscriptionToSubscriptionWithService(row: any): SubscriptionWithService {
    return {
      ...this.mapDbSubscriptionToSubscription(row),
      service: {
        id: row.service_id,
        name: row.service_name,
        price: row.service_price,
        unit: row.service_unit,
        icon: row.service_icon,
        route: row.service_route,
        description: row.service_description,
        is_active: row.service_is_active
      }
    };
  }
}
