import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `
      SELECT id, date, amount, status, pdf_url
      FROM invoices
      WHERE user_id = $1
      ORDER BY date DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
