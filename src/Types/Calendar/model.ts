import pool from '@/src/lib/db';
import { CalendarEvent, CreateCalendarEvent } from "./type";

export class CalendarEventModel {
    constructor(public data: CalendarEvent) {}

    // Récupérer tous les événements d'un utilisateur
    async getEventsByUserId(userId: number): Promise<CalendarEvent[]> {
        const res = await pool.query(
            'SELECT * FROM calendar_events WHERE user_id = $1 ORDER BY start_time',
            [userId]
        );
        return res.rows;
    }

    // Créer un nouvel événement
    async createEvent(event: CreateCalendarEvent): Promise<CalendarEvent> {
        const res = await pool.query(
            `INSERT INTO calendar_events (user_id, title, start_time, end_time, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [event.user_id, event.title, event.start_time, event.end_time, event.description]
        );
        return res.rows[0];
    }

    // Mettre à jour un événement
    async updateEvent(id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (event.title !== undefined) {
            fields.push(`title = $${paramIndex}`);
            values.push(event.title);
            paramIndex++;
        }
        if (event.start_time !== undefined) {
            fields.push(`start_time = $${paramIndex}`);
            values.push(event.start_time);
            paramIndex++;
        }
        if (event.end_time !== undefined) {
            fields.push(`end_time = $${paramIndex}`);
            values.push(event.end_time);
            paramIndex++;
        }
        if (event.description !== undefined) {
            fields.push(`description = $${paramIndex}`);
            values.push(event.description);
            paramIndex++;
        }

        const res = await pool.query(
            `UPDATE calendar_events SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            [...values, id]
        );
        return res.rows[0];
    }

    // Supprimer un événement
    async deleteEvent(id: number): Promise<void> {
        await pool.query('DELETE FROM calendar_events WHERE id = $1', [id]);
    }

    // Récupérer les événements dans un intervalle de dates
    async getEventsInRange(
        userId: number,
        startDate: Date,
        endDate: Date
        ): Promise<CalendarEvent[]> {
        const res = await pool.query(
            `SELECT * FROM calendar_events
            WHERE user_id = $1
            AND start_time >= $2
            AND end_time <= $3
            ORDER BY start_time`,
            [userId, startDate, endDate]
        );
        return res.rows;
    }

     // Récupérer un événement par son ID (NOUVELLE FONCTION)
    async getEventById(id: number): Promise<CalendarEvent | null> {
        const res = await pool.query(
        "SELECT * FROM calendar_events WHERE id = $1",
        [id]
        );
        return res.rows[0] || null;
    }

}