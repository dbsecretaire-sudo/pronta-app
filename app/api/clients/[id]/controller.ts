import { Request, Response } from 'express';
import pool from '@/lib/db';

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifie si le client est lié à des factures
    const checkQuery = 'SELECT 1 FROM invoices WHERE client_id = $1 LIMIT 1';
    const checkRes = await pool.query(checkQuery, [id]);

    if (checkRes.rows.length > 0) {
      return res.status(400).json({
        error: "Ce client est lié à des factures et ne peut pas être supprimé"
      });
    }

    // Supprime le client
    const deleteQuery = 'DELETE FROM clients WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(deleteQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur DELETE :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du client" });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, company } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Le nom et l'email sont obligatoires"
      });
    }

    const query = `
      UPDATE clients
      SET name = $1, email = $2, phone = $3, address = $4, company = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const { rows } = await pool.query(query, [name, email, phone, address, company, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === '23505') {
      return res.status(409).json({
        error: "Un client avec cet email existe déjà"
      });
    }

    console.error("Erreur PUT :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du client" });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM clients WHERE id = $1';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur GET :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du client" });
  }
};
