import pool from "@/src/lib/db";
import { User, CreateUser, UpdateUser, UserFilter, Role, BillingAddress, PaymentMethod } from "./type";

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
      phone: dbUser.phone,
      company: dbUser.company,
      billing_address: dbUser.billing_address ? JSON.parse(dbUser.billing_address) : undefined,
      payment_method: dbUser.payment_method ? JSON.parse(dbUser.payment_method) : undefined,
      subscription: dbUser.subscription ? {
        plan: dbUser.subscription.plan,
        start_date: dbUser.subscription.start_date ? new Date(dbUser.subscription.start_date) : "",
        end_date: dbUser.subscription.end_date ? new Date(dbUser.subscription.end_date) : "",
        next_payment_date: dbUser.subscription.next_payment_date ? new Date(dbUser.subscription.next_payment_date) : "",
        status: dbUser.subscription.status || 'active',
      } : {
        plan: '',
        status: 'active',
        start_date: "",
        end_date: "",
        next_payment_date: ""
      },
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
  let paramIndex = 1;

  // Fonction utilitaire pour ajouter un champ à la requête
  const addField = (sql: string, value: any) => {
    fields.push(sql);
    values.push(value);
    paramIndex++;
  };

  // Champs simples
  user.email !== undefined && addField(`email = $${paramIndex}`, user.email);
  user.name !== undefined && addField(`name = $${paramIndex}`, user.name);
  user.role !== undefined && addField(`role = $${paramIndex}`, user.role);
  user.phone !== undefined && addField(`phone = $${paramIndex}`, user.phone);
  user.company !== undefined && addField(`company = $${paramIndex}`, user.company);

  // Champs JSONB complexes
  if (user.billing_address !== undefined) {
    addField(
      `billing_address = $${paramIndex}`,
      user.billing_address ? JSON.stringify(user.billing_address) : null
    );
  }

  if (user.payment_method !== undefined) {
    addField(
      `payment_method = $${paramIndex}`,
      user.payment_method ? JSON.stringify(user.payment_method) : null
    );
  }

  // Gestion du champ subscription
  if (user.subscription !== undefined) {
    // Préparation de l'objet subscription pour la mise à jour complète
    const subscriptionUpdate: Record<string, any> = {};

    // Ajout des champs modifiés
    if (user.subscription.plan !== undefined) {
      subscriptionUpdate.plan = user.subscription.plan;
    }
    if (user.subscription.status !== undefined) {
      subscriptionUpdate.status = user.subscription.status;
    }
    if (user.subscription.start_date !== undefined) {
      subscriptionUpdate.start_date = user.subscription.start_date instanceof Date ?
        user.subscription.start_date.toISOString() :
        user.subscription.start_date;
    }
    if (user.subscription.end_date !== undefined) {
      subscriptionUpdate.end_date = user.subscription.end_date instanceof Date ?
        user.subscription.end_date.toISOString() :
        user.subscription.end_date;
    }
    if (user.subscription.next_payment_date !== undefined) {
      subscriptionUpdate.next_payment_date = user.subscription.next_payment_date instanceof Date ?
        user.subscription.next_payment_date.toISOString() :
        user.subscription.next_payment_date;
    }

    // Si on a des champs à mettre à jour dans subscription
    if (Object.keys(subscriptionUpdate).length > 0) {
      addField(
        `subscription = $${paramIndex}`,
        JSON.stringify(subscriptionUpdate)
      );
    }
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  // Construction et exécution de la requête
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


async createUser(user: Omit<CreateUser, "password"> & { password_hash: string }): Promise<User> {
  // Valeurs par défaut pour subscription
  const subscription = {
    plan: user.subscription?.plan || '',
    start_date: user.subscription?.start_date?.toString() || new Date().toISOString(),
    end_date: user.subscription?.end_date?.toString(),
    next_payment_date: user.subscription?.next_payment_date?.toString(),
    status: user.subscription?.status || 'active'
  };

  const res = await pool.query(
    `INSERT INTO users (
      email, password_hash, name, role, phone, company,
      billing_address, payment_method, subscription
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      user.email,
      user.password_hash,
      user.name || '',
      user.role || 'CLIENT',
      user.phone || '',
      user.company || '',
      user.billing_address ? JSON.stringify(user.billing_address) : null,
      user.payment_method ? JSON.stringify(user.payment_method) : null,
      JSON.stringify(subscription)
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

async updateUserSubscription(id: number, plan_d: string, updates: {
  plan?: string;
  status?: string;
  end_date?: Date;
  next_payment_date?: Date;
  start_date?: Date;
}): Promise<User> {
  // Vérification que le plan à mettre à jour correspond au plan_d
  const checkQuery = `
    SELECT subscription->>'plan' as current_plan
    FROM users
    WHERE id = $1
  `;
  const checkRes = await pool.query(checkQuery, [id]);

  if (checkRes.rows.length === 0) {
    throw new Error('User not found');
  }

  const currentPlan = checkRes.rows[0].current_plan;

  // Si le plan actuel ne correspond pas à plan_d, on ne fait rien
  if (currentPlan !== plan_d) {
    throw new Error(`Cannot update subscription: current plan (${currentPlan}) does not match target plan (${plan_d})`);
  }

  const { plan, status, end_date, next_payment_date, start_date } = updates;
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (plan !== undefined) {
    fields.push(`subscription = jsonb_set(COALESCE(subscription, '{}'::jsonb), '{plan}', to_jsonb($${paramIndex}::text))`);
    values.push(plan);
    paramIndex++;
  }
  if (status !== undefined) {
    fields.push(`subscription = jsonb_set(COALESCE(subscription, '{}'::jsonb), '{status}', to_jsonb($${paramIndex}::text))`);
    values.push(status);
    paramIndex++;
  }
  if (end_date !== undefined) {
    fields.push(`subscription = jsonb_set(COALESCE(subscription, '{}'::jsonb), '{end_date}', to_jsonb($${paramIndex}::text))`);
    values.push(end_date.toISOString());
    paramIndex++;
  }
  if (next_payment_date !== undefined) {
    fields.push(`subscription = jsonb_set(COALESCE(subscription, '{}'::jsonb), '{next_payment_date}', to_jsonb($${paramIndex}::text))`);
    values.push(next_payment_date.toISOString());
    paramIndex++;
  }
  if (start_date !== undefined) {
    fields.push(`subscription = jsonb_set(COALESCE(subscription, '{}'::jsonb), '{start_date}', to_jsonb($${paramIndex}::text))`);
    values.push(start_date.toISOString());
    paramIndex++;
  }

  if (fields.length === 0) {
    throw new Error('No subscription fields to update');
  }

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex} AND subscription->>'plan' = $${paramIndex + 1}
    RETURNING *
  `;
  values.push(id, plan_d); // Ajout de plan_d comme dernier paramètre

  const res = await pool.query(query, values);
  if (res.rows.length === 0) {
    throw new Error('User not found or plan does not match');
  }

  return this.mapDbUserToUser(res.rows[0]);
}

}
