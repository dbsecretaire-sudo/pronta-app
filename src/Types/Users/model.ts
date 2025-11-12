import pool from "@/src/lib/db";
import { User, CreateUser, UpdateUser, UserFilter, Role, BillingAddress, PaymentMethod } from "./type";
import { Subscription } from "../Subscription";
import { Service } from "../Services";

export class UserModel {
  constructor(public data: User) {}

  // Helper pour mapper les résultats de la base de données vers un objet User
  mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password_hash: dbUser.password_hash,
      name: dbUser.name || undefined,
      created_at: dbUser.created_at ? new Date(dbUser.created_at) : undefined,
      billing_address:
        typeof dbUser.billing_address === 'string'
          ? JSON.parse(dbUser.billing_address)
          : dbUser.billing_address || undefined,
      payment_method:
        dbUser.payment_method
          ? typeof dbUser.payment_method === 'string'
            ? this.mapDbPaymentMethod(JSON.parse(dbUser.payment_method))
            : this.mapDbPaymentMethod(dbUser.payment_method)
          : undefined,
      phone: dbUser.phone || undefined,
      company: dbUser.company || undefined,
      role: dbUser.role,
      can_write: dbUser.can_write,
      can_delete: dbUser.can_delete,
      service_ids: dbUser.service_ids
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

  // Helper pour mapper les abonnements de la base de données
  private mapDbSubscriptionToSubscription(dbSubscription: any): Subscription {
    return {
      id: dbSubscription.id,
      user_id: dbSubscription.user_id,
      service_id: dbSubscription.service_id,
      status: dbSubscription.status,
      start_date: dbSubscription.start_date,
      end_date: dbSubscription.end_date ? new Date(dbSubscription.end_date) : undefined,
      next_payment_date: dbSubscription.next_payment_date ? new Date(dbSubscription.next_payment_date) : undefined,
      created_at: dbSubscription.created_at ? new Date(dbSubscription.created_at) : undefined,
      updated_at: dbSubscription.updated_at ? new Date(dbSubscription.updated_at) : undefined
    };
  }

  private mapDbServiceToService(dbService: any): Service {
    return {
      id : dbService.id,
      name: dbService.name,
      description: dbService.description,
      route: dbService.route,
      icon: dbService.icon,
      price: dbService.price,
      unit: dbService.unit,
      is_active: dbService.is_active,
    }
  }

  async getAllUsersName(): Promise<Record<number, { id: number; name: string }>> {
    const query = `
      SELECT id, name
      FROM users
      ORDER BY created_at DESC
    `;
    const res = await pool.query(query);
    // Crée une map { id: { id, name } } pour un accès rapide
    return res.rows.reduce((acc: Record<number, { id: number; name: string }>, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }
  
  async getAllUsersRole(): Promise<Record<number, { id: number; role: string }>> {
    const query = `
      SELECT id, role
      FROM users
      ORDER BY created_at DESC
    `;
    const res = await pool.query(query);
    // Crée une map { id: { id, name } } pour un accès rapide
    return res.rows.reduce((acc: Record<number, { id: number; role: string }>, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }

  async getAllUsers(): Promise<User[]> {
    let query = "SELECT * FROM users";
    const res = await pool.query(query);
    return res.rows;
    // Pour chaque utilisateur, récupérer ses abonnements
    // const usersWithSubscriptions = await Promise.all(
    //   res.rows.map(async (row) => {
    //     const user = this.mapDbUserToUser(row);
    //     const subscriptions = await this.getUserSubscriptions(user.id);
    //     return { ...user, subscriptions };
    //   })
    // );

    // return usersWithSubscriptions;
  }

  async getUserById(id: number): Promise<User> {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (res.rows.length === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    const user = this.mapDbUserToUser(res.rows[0]);
    return { ...user };
  }

  async getRoleByUserId(id: number): Promise<{ role: Role }> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid user ID');
    }

    const res = await pool.query("SELECT role FROM users WHERE id = $1", [id]);

    if (res.rows.length === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    // Vérifie que `res.rows[0].role` existe et est valide
    if (!res.rows[0].role) {
      throw new Error(`User with id ${id} has no role assigned`);
    }

    // Retourne directement l'objet avec le rôle
    return { role: res.rows[0].role as Role };
  }

  async getUserServices(id: number): Promise<{ services: Service[] }> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid user ID');
    }

    // 1. Récupérer les service_ids de l'utilisateur
    const userRes = await pool.query(
      "SELECT service_ids FROM users WHERE id = $1",
      [id]
    );

    if (userRes.rows.length === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    const { service_ids } = userRes.rows[0];

    // 2. Si l'utilisateur n'a aucun service, retourner un tableau vide
    if (!service_ids || service_ids.length === 0) {
      return { services: [] };
    }

    // 3. Récupérer les détails des services correspondants
    const servicesRes = await pool.query(
      "SELECT * FROM services WHERE id = ANY($1)",
      [service_ids]
    );

    // 4. Mapper les résultats en objets Service
    const services = servicesRes.rows.map(row => this.mapDbServiceToService(row));

    return { services };
  }

  async getUserByEmail(email: string): Promise<User> {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (res.rows.length === 0) {
      throw new Error(`User with email ${email} not found`);
    }

    const user = this.mapDbUserToUser(res.rows[0]);
    return { ...user };
  }

  // Nouvelle méthode pour récupérer les abonnements d'un utilisateur
  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    const query = `
      SELECT * FROM user_subscriptions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const res = await pool.query(query, [userId]);
    return res.rows.map(this.mapDbSubscriptionToSubscription);
  }

  async updateUser(id: number, userData: UpdateUser): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    const addField = (sql: string, value: any) => {
      fields.push(sql);
      values.push(value);
      paramIndex++;
    };

    // Champs simples
    if (userData.email !== undefined) addField(`email = $${paramIndex}`, userData.email);
    if (userData.name !== undefined) addField(`name = $${paramIndex}`, userData.name);
    if (userData.role !== undefined) addField(`role = $${paramIndex}`, userData.role);
    if (userData.phone !== undefined) addField(`phone = $${paramIndex}`, userData.phone);
    if (userData.company !== undefined) addField(`company = $${paramIndex}`, userData.company);
    if (userData.can_write !== undefined) addField(`can_write = $${paramIndex}`, userData.can_write);
    if (userData.can_delete !== undefined) addField(`can_delete = $${paramIndex}`, userData.can_delete);

    // Gestion du tableau service_ids (remplacement complet)
    if (userData.service_ids !== undefined) {
      addField(`service_ids = $${paramIndex}`, userData.service_ids);
    }

    // Champs JSONB complexes
    if (userData.billing_address !== undefined) {
      addField(
        `billing_address = $${paramIndex}`,
        userData.billing_address ? JSON.stringify(userData.billing_address) : null
      );
    }
    if (userData.payment_method !== undefined) {
      addField(
        `payment_method = $${paramIndex}`,
        userData.payment_method ? JSON.stringify(userData.payment_method) : null
      );
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    values.push(id);

    try {
      const res = await pool.query(query, values);
      if (res.rows.length === 0) {
        throw new Error('User not found');
      }
      return this.mapDbUserToUser(res.rows[0]);
    } catch (error) {
      throw error;
    }
  }

 async createUser(
    user: Omit<CreateUser, "password"> & { password_hash: string }
  ): Promise<User> {
    const res = await pool.query(
      `INSERT INTO users (
        email, password_hash, name, role, phone, company, can_write, can_delete,
        billing_address, payment_method, service_ids
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        user.email,
        user.password_hash,
        user.name || '',
        user.role || 'CLIENT',
        user.phone || '',
        user.company || '',
        user.can_write || false,
        user.can_delete || false, // Corrigé : can_delete au lieu de can_write
        user.billing_address ? JSON.stringify(user.billing_address) : null,
        user.payment_method ? JSON.stringify(user.payment_method) : null,
        user.service_ids || [] // Ajout du tableau service_ids (par défaut, un tableau vide)
      ]
    );
    const createdUser = this.mapDbUserToUser(res.rows[0]);
    return this.getUserById(createdUser.id);
  }


  // Nouvelle méthode pour créer un abonnement
  async createUserSubscription(userId: number, subscription: {
    plan: string;
    status?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    next_payment_date?: string | Date;
  }): Promise<void> {
    const query = `
      INSERT INTO user_subscriptions
      (user_id, plan, status, start_date, end_date, next_payment_date)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [
      userId,
      subscription.plan,
      subscription.status || 'active',
      subscription.start_date instanceof Date ?
        subscription.start_date.toISOString() :
        subscription.start_date || new Date().toISOString(),
      subscription.end_date instanceof Date ?
        subscription.end_date.toISOString() :
        subscription.end_date,
      subscription.next_payment_date instanceof Date ?
        subscription.next_payment_date.toISOString() :
        subscription.next_payment_date
    ]);
  }

  async deleteUser(id: number): Promise<void> {
    // La suppression en cascade est gérée par la base (ON DELETE CASCADE)
    const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    if (res.rows.length === 0) {
      throw new Error('User not found');
    }
  }

  // Méthode mise à jour pour récupérer les utilisateurs par plan d'abonnement
  async getUsersBySubscriptionPlan(plan: string): Promise<User[]> {
    const query = `
      SELECT DISTINCT u.* FROM users u
      JOIN user_subscriptions us ON u.id = us.user_id
      WHERE us.plan = $1
      ORDER BY u.created_at DESC
    `;

    const res = await pool.query(query, [plan]);

    // Pour chaque utilisateur, récupérer ses abonnements
    const usersWithSubscriptions = await Promise.all(
      res.rows.map(async (row) => {
        const user = this.mapDbUserToUser(row);
        const subscriptions = await this.getUserSubscriptions(user.id);
        return { ...user, subscriptions };
      })
    );

    return usersWithSubscriptions;
  }

  // Méthode mise à jour pour récupérer les utilisateurs avec abonnement actif
  async getUsersWithActiveSubscription(): Promise<User[]> {
    const query = `
      SELECT DISTINCT u.* FROM users u
      JOIN user_subscriptions us ON u.id = us.user_id
      WHERE us.status = 'active'
      ORDER BY u.created_at DESC
    `;

    const res = await pool.query(query);

    // Pour chaque utilisateur, récupérer ses abonnements
    const usersWithSubscriptions = await Promise.all(
      res.rows.map(async (row) => {
        const user = this.mapDbUserToUser(row);
        const subscriptions = await this.getUserSubscriptions(user.id);
        return { ...user, subscriptions };
      })
    );

    return usersWithSubscriptions;
  }

  // Nouvelle méthode pour mettre à jour un abonnement utilisateur
  async updateUserSubscription(
    userId: number,
    subscriptionId: number,
    updates: {
      plan?: string;
      status?: string;
      start_date?: string | Date;
      end_date?: string | Date;
      next_payment_date?: string | Date | null;
    }
  ): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.plan !== undefined) {
      fields.push(`plan = $${paramIndex}`);
      values.push(updates.plan);
      paramIndex++;
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(updates.status);
      paramIndex++;
    }
    if (updates.start_date !== undefined) {
      fields.push(`start_date = $${paramIndex}`);
      values.push(updates.start_date instanceof Date ?
                  updates.start_date.toISOString() :
                  updates.start_date);
      paramIndex++;
    }
    if (updates.end_date !== undefined) {
      fields.push(`end_date = $${paramIndex}`);
      values.push(updates.end_date instanceof Date ?
                  updates.end_date.toISOString() :
                  updates.end_date);
      paramIndex++;
    }
    if (updates.next_payment_date !== undefined) {
      fields.push(`next_payment_date = $${paramIndex}`);
      values.push(updates.next_payment_date instanceof Date ?
                  updates.next_payment_date.toISOString() :
                  updates.next_payment_date);
      paramIndex++;
    }

    if (fields.length > 0) {
      const query = `
        UPDATE user_subscriptions
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      `;
      values.push(subscriptionId, userId);

      await pool.query(query, values);
    }
  }

  // Nouvelle méthode pour supprimer un abonnement
  async deleteUserSubscription(userId: number, subscriptionId: number): Promise<void> {
    const query = `
      DELETE FROM user_subscriptions
      WHERE id = $1 AND user_id = $2
    `;

    await pool.query(query, [subscriptionId, userId]);
  }

  // Nouvelle méthode pour ajouter un abonnement à un utilisateur
  async addSubscriptionToUser(
    userId: number,
    subscription: {
      plan: string;
      status?: string;
      start_date?: string | Date;
      end_date?: string | Date;
      next_payment_date?: string | Date;
    }
  ): Promise<void> {
    return this.createUserSubscription(userId, subscription);
  }

  async addServiceToUser(userId: number, serviceId: number): Promise<void> {
    await pool.query(
      `UPDATE users
      SET service_ids =
          CASE
            WHEN service_ids IS NULL THEN ARRAY[$1]
            ELSE array_append(service_ids, $1)
          END
      WHERE id = $2
      AND NOT ($1 = ANY(COALESCE(service_ids, ARRAY[]::integer[])));`,
      [serviceId, userId]
    );
  }

  async removeServiceFromUser(userId: number, serviceId: number): Promise<void> {
    await pool.query(
      `UPDATE users
      SET service_ids = array_remove(service_ids, $1)
      WHERE id = $2`,
      [serviceId, userId]
    );
  }
}
