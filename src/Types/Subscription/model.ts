 import pool from "@/src/lib/db";
 import {  Subscription, CreateSubscription, UpdateSubscription, SubscriptionWithService } from "./index";
import { User } from "../Users";
 
 export class SubscriptionModel {
   constructor(public data: Subscription) {}
 
 async createSubscription(subscription: CreateSubscription): Promise<Subscription> {
    const query = `
      INSERT INTO user_subscriptions (
        user_id, service_id, status, start_date, end_date, next_payment_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      subscription.user_id,
      subscription.service_id,
      subscription.status || 'active',
      subscription.start_date instanceof Date ?
        subscription.start_date.toISOString() :
        subscription.start_date,
      subscription.end_date instanceof Date ?
        subscription.end_date?.toISOString() :
        subscription.end_date,
      subscription.next_payment_date instanceof Date ?
        subscription.next_payment_date?.toISOString() :
        subscription.next_payment_date
    ]);

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  async updateSubscription(id: number, subscriptionData: UpdateSubscription): Promise<Subscription> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (subscriptionData.service_id !== undefined) {
      fields.push(`service_id = $${paramIndex}`);
      values.push(subscriptionData.service_id);
      paramIndex++;
    }
    if (subscriptionData.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(subscriptionData.status);
      paramIndex++;
    }
    if (subscriptionData.start_date !== undefined) {
      fields.push(`start_date = $${paramIndex}`);
      values.push(subscriptionData.start_date instanceof Date ?
        subscriptionData.start_date.toISOString() :
        subscriptionData.start_date);
      paramIndex++;
    }
    if (subscriptionData.end_date !== undefined) {
      fields.push(`end_date = $${paramIndex}`);
      values.push(subscriptionData.end_date instanceof Date ?
        subscriptionData.end_date?.toISOString() :
        subscriptionData.end_date);
      paramIndex++;
    }
    if (subscriptionData.next_payment_date !== undefined) { // Inclut null
      fields.push(`next_payment_date = $${paramIndex}`);
      values.push(
        subscriptionData.next_payment_date === null
          ? null // ⬅️ Envoie NULL à PostgreSQL
          : subscriptionData.next_payment_date instanceof Date
            ? subscriptionData.next_payment_date.toISOString()
            : subscriptionData.next_payment_date // string déjà au format ISO
      );
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE user_subscriptions
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    values.push(id);

    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      throw new Error('Subscription not found');
    }

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  async getUserWithSubscriptions(userId: number): Promise<User & { subscriptions: Subscription[] }> {
    // 1. Récupérer l'utilisateur
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const { rows: userRows } = await pool.query(userQuery, [userId]);

    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    // 2. Récupérer les abonnements
    const subscriptionsQuery = `
      SELECT * FROM user_subscriptions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const { rows: subscriptionRows } = await pool.query(subscriptionsQuery, [userId]);

    // 3. Construire l'objet complet
    return {
      ...this.mapDbUserToUser(userRows[0]),
      subscriptions: subscriptionRows.map(row => this.mapDbSubscriptionToSubscription(row))
    };
  }

  async getSubscriptionById(subscriptionId: number): Promise<Subscription> {
    const query = 'SELECT * FROM user_subscriptions WHERE id = $1';
    const { rows } = await pool.query(query, [subscriptionId]);

    if (rows.length === 0) {
      throw new Error('Subscription not found');
    }

    return this.mapDbSubscriptionToSubscription(rows[0]);
  }

  async getSubscriptionByUserId(userId: number): Promise<SubscriptionWithService[]> {
    const query = `
      SELECT
        user_subscriptions.*,
        services.name AS service_name,
        services.price AS service_price,
        services.unit AS service_unit,
        services.route AS service_route,
        services.icon AS service_icon,
        services.description AS service_description
      FROM
        user_subscriptions
      JOIN
        services
      ON
        user_subscriptions.service_id = services.id
      WHERE
        user_subscriptions.user_id = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.map(row => this.mapDbSubscriptionToSubscriptionWithService(row));
  }

  async getSubscriptionByUserIdAndService(userId: number, service_id: number): Promise<Subscription[]> {
    const query = 'SELECT * FROM user_subscriptions WHERE user_id = $1 AND service_id = $2';
    const { rows } = await pool.query(query, [userId, service_id]);
    return rows.map(row => this.mapDbSubscriptionToSubscription(row));
  }

  // Mappers
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

  private mapDbSubscriptionToSubscription(dbSubscription: any): Subscription {
    return {
      id: dbSubscription.id,
      user_id: dbSubscription.user_id,
      service_id: dbSubscription.service_id,
      status: dbSubscription.status,
      start_date: dbSubscription.start_date,
      end_date: dbSubscription.end_date ? new Date(dbSubscription.end_date) : undefined,
      next_payment_date: dbSubscription.next_payment_date ? new Date(dbSubscription.next_payment_date) : undefined
    };
  }

  private mapDbSubscriptionToSubscriptionWithService(row: any): SubscriptionWithService {
    return {
      id: row.id,
      user_id: row.user_id,
      service_id: row.service_id,
      status: row.status,
      start_date: row.start_date,
      end_date: row.end_date,
      next_payment_date: row.next_payment_date,
      created_at: row.created_at,
      updated_at: row.updated_at,
      service: {
        id: row.service_id,
        name: row.service_name,
        price: row.service_price,
        unit: row.service_unit,
        icon: row.service_icon,
        route: row.service_route,
        description: row.service_description,
        is_active: row.service_isActive
      },
    };
  }

async getAllSubscriptions(): Promise<Subscription[]> {
  const res = await pool.query('SELECT * FROM user_subscriptions ORDER BY created_at DESC');
  return res.rows;
}

/**
 * Crée un nouvel abonnement pour un utilisateur
 * @param userId ID de l'utilisateur
 * @param subscriptionData Données de l'abonnement à créer
 * @returns L'abonnement créé
 */
async createUserSubscription(
  userId: number,
  subscriptionData: CreateSubscription
): Promise<Subscription> {
  // Vérification que l'utilisateur existe
  const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
  if (userCheck.rows.length === 0) {
    throw new Error(`User with id ${userId} not found`);
  }

  const query = `
    INSERT INTO user_subscriptions (
      user_id, service_id, status, start_date, end_date, next_payment_date
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    userId,
    subscriptionData.service_id,
    subscriptionData.status || 'active',
    subscriptionData.start_date instanceof Date ?
      subscriptionData.start_date.toISOString() :
      subscriptionData.start_date || new Date().toISOString(),
    subscriptionData.end_date instanceof Date ?
      subscriptionData.end_date?.toISOString() :
      subscriptionData.end_date,
    subscriptionData.next_payment_date instanceof Date ?
      subscriptionData.next_payment_date?.toISOString() :
      subscriptionData.next_payment_date
  ]);

  return this.mapDbSubscriptionToSubscription(rows[0]);
}

/**
 * Supprime un abonnement
 * @param subscriptionId ID de l'abonnement à supprimer
 * @returns Promesse vide
 */
async deleteUserSubscription(subscriptionId: number): Promise<void> {
  // Vérification que l'abonnement existe
  const subscriptionCheck = await pool.query(
    'SELECT id FROM user_subscriptions WHERE id = $1',
    [subscriptionId]
  );
  if (subscriptionCheck.rows.length === 0) {
    throw new Error(`Subscription with id ${subscriptionId} not found`);
  }

  const query = `
    DELETE FROM user_subscriptions
    WHERE id = $1
  `;

  await pool.query(query, [subscriptionId]);
}


}
