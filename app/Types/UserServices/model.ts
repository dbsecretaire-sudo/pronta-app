import { UserService, AssignServiceToUser, UserServiceWithDetails, UpdateUserServicePermissions } from "./type";
import pool from "@/app/lib/db";

export class UserServiceModel {
    constructor(public data:UserService) {}

    async getUserServices(userId: number): Promise<UserServiceWithDetails[]> {
        const res = await pool.query(
        `SELECT us.user_id, us.service_id, us.subscription_date, us.is_active, us.can_write, us.can_delete,
                s.id AS service_id, s.name AS service_name,
                s.description AS service_description, s.route AS service_route,
                s.icon AS service_icon
        FROM user_services us
        JOIN services s ON us.service_id = s.id
        WHERE us.user_id = $1`,
        [userId]
        );

        return res.rows.map(row => ({
        user_id: row.user_id,
        service_id: row.service_id,
        subscription_date: row.subscription_date,
        is_active: row.is_active,
        can_write: row.can_write,
        can_delete: row.can_delete,
        service: {
            id: row.service_id,
            name: row.service_name,
            description: row.service_description,
            route: row.service_route,
            icon: row.service_icon,
        },
        }));
    }

    // Récupère un service spécifique d'un utilisateur
  async getUserService(userId: number, serviceId: number): Promise<UserServiceWithDetails | null> {
    const res = await pool.query(
      `SELECT us.user_id, us.service_id, us.subscription_date, us.is_active, us.can_write, us.can_delete,
              s.id AS service_id, s.name AS service_name,
              s.description AS service_description, s.route AS service_route,
              s.icon AS service_icon
       FROM user_services us
       JOIN services s ON us.service_id = s.id
       WHERE us.user_id = $1 AND us.service_id = $2`,
      [userId, serviceId]
    );

    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      user_id: row.user_id,
      service_id: row.service_id,
      subscription_date: row.subscription_date,
      is_active: row.is_active,
      can_write: row.can_write,
      can_delete: row.can_delete,
      service: {
        id: row.service_id,
        name: row.service_name,
        description: row.service_description,
        route: row.service_route,
        icon: row.service_icon,
      },
    };
  }

      // Assigne un service à un utilisateur (avec permissions par défaut)
  async assignServiceToUser(data: AssignServiceToUser): Promise<UserService> {
    const res = await pool.query(
      `INSERT INTO user_services (user_id, service_id, is_active, can_write, can_delete)
       VALUES ($1, $2, COALESCE($3, TRUE), COALESCE($4, FALSE), COALESCE($5, FALSE))
       RETURNING *`,
      [
        data.user_id,
        data.service_id,
        data.is_active,
        data.can_write,
        data.can_delete
      ]
    );
    return res.rows[0];
  }

  async updateUserService(
     userId: number,
    serviceId: number,
    permissions: UpdateUserServicePermissions
  ): Promise<UserService> {
    const entries = Object.entries(permissions).filter(([_, value]) => value !== undefined);
    if (entries.length === 0) {
      const res = await pool.query(
        `SELECT * FROM user_services WHERE user_id = $1 AND service_id = $2`,
        [userId, serviceId]
      );
      return res.rows[0];
    }

    const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`).join(", ");
    const values = entries.map(([_, value]) => value);

    const res = await pool.query(
      `UPDATE user_services
       SET ${setClauses}
       WHERE user_id = $${entries.length + 1} AND service_id = $${entries.length + 2}
       RETURNING *`,
      [...values, userId, serviceId]
    );
    return res.rows[0];
  }

  // Désactive un service pour un utilisateur
  async deactivateUserService(userId: number, serviceId: number): Promise<UserService> {
    const res = await pool.query(
      `UPDATE user_services
       SET is_active = FALSE
       WHERE user_id = $1 AND service_id = $2
       RETURNING *`,
      [userId, serviceId]
    );
    return res.rows[0];
  }
}