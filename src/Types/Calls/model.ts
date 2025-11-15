import { Call, CallFilter } from "./type";
import pool from "@/src/lib/db";

export class CallModel {
    constructor(public data: Call) {}

    // Récupérer les appels d'un utilisateur
    async getCallsByUserId(filters: CallFilter): Promise<Call[]> {
        // Vérifie que userId est bien fourni (redondant avec le typage, mais utile pour le runtime)
        if (filters.userId === undefined) {
        throw new Error("userId is required in filters");
        }

        let query = 'SELECT * FROM calls WHERE user_id = $1';
        const params: any[] = [filters.userId];  // userId est obligatoire

        if (filters.byName) {
        query += ' AND contact_name ILIKE $' + (params.length + 1);
        params.push(`%${filters.byName}%`);
        }
        if (filters.byPhone) {
        query += ' AND phone ILIKE $' + (params.length + 1);
        params.push(`%${filters.byPhone}%`);
        }

        const res = await pool.query(query, params);
        return res.rows;
    }

    // Créer un appel
    async createCall(call: Omit<Call, 'id'>): Promise<Call> {
        const res = await pool.query(
            `INSERT INTO calls (user_id, name, phone, date, type, summary, duration, phone_number, contact_name, client_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [call.user_id, call.name, call.phone, call.date, call.type, call.summary, call.duration, call.phoneNumber, call.contact_name, call.client_id]
        );
        return res.rows[0];
    }

    // Récupérer un appel par son ID
    async getCallById(id: number): Promise<Call | null> {
        const res = await pool.query('SELECT * FROM calls WHERE id = $1', [id]);
        return res.rows[0] || null;
    }

    async getAllCalls(): Promise<Call[]> {
        const res = await pool.query('SELECT * FROM calls');
        return res.rows;
    }

    // Mettre à jour un appel
    async updateCall(id: number, call: Partial<Call>): Promise<Call> {
        const entries = Object.entries(call).filter(([_, value]) => value !== undefined);
        if (entries.length === 0) {
            const res = await pool.query('SELECT * FROM calls WHERE id = $1', [id]);
            return res.rows[0];
        }
        const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
        const values = entries.map(([_, value]) => value);
        const res = await pool.query(
            `UPDATE calls SET ${fields} WHERE id = $${entries.length + 1} RETURNING *`,
            [...values, id]
        );
        return res.rows[0];
    }

    // Supprimer un appel
    async deleteCall(id: number): Promise<void> {
        await pool.query('DELETE FROM calls WHERE id = $1', [id]);
    }

}