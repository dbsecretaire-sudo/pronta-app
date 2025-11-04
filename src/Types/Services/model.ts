import { Service } from "./type";
import pool from "@/src/lib/db";

export class ServiceModel {
    constructor(public data:Service) {}

    async getAllServices(): Promise<Service[]> {
        const res = await pool.query('SELECT * FROM services');
        return res.rows;
    }

    async getServiceById(id: number): Promise<Service | null> {
        const res = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
        return res.rows[0] || null;
    }

    async getServiceByName(name: string): Promise<Service | null> {
        const res = await pool.query('SELECT * FROM services WHERE name = $1', [name]);
        return res.rows[0] || null;
    }

    // Créer un service
    async createService(service: Omit<Service, "id">): Promise<Service> {
        const res = await pool.query(
            `INSERT INTO services (name, description, route, icon, price, unit)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [service.name, service.description, service.route, service.icon, service.price, service.unit]
        );
        return res.rows[0];
    }

    // Mettre à jour un service
    async updateService(id: number, service: Partial<Service>): Promise<Service> {
        const entries = Object.entries(service).filter(([_, value]) => value !== undefined);
        if (entries.length === 0) {
            const res = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
            return res.rows[0];
        }
        const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
        const values = entries.map(([_, value]) => value);
        const res = await pool.query(
            `UPDATE services SET ${fields} WHERE id = $${entries.length + 1} RETURNING *`,
            [...values, id]
        );
        return res.rows[0];
    }

    // Supprimer un service
    async deleteService(id: number): Promise<void> {
        await pool.query('DELETE FROM services WHERE id = $1', [id]);
    }

}