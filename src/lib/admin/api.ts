import pool from '@/src/lib/db';

export async function fetchResource(resource: string) {
  switch (resource) {
    case 'clients':
      const clients = await pool.query('SELECT * FROM clients');
      return clients.rows;
    case 'calls':
      const calls = await pool.query('SELECT * FROM calls ORDER BY date DESC');
      return calls.rows;
    default:
      return [];
  }
}

export async function fetchResourceItem(resource: string, id: string) {
  switch (resource) {
    case 'clients':
      const client = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
      return client.rows[0] || null;
    case 'calls':
      const call = await pool.query('SELECT * FROM calls WHERE id = $1', [id]);
      return call.rows[0] || null;
    default:
      return null;
  }
}

export async function updateResource(resource: string, id: string | undefined, data: any) {
  switch (resource) {
    case 'clients':
      if (id) {
        // Mise à jour
        const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const query = `UPDATE clients SET ${fields} WHERE id = $1 RETURNING *`;
        const updatedClient = await pool.query(query, [id, ...values]);
        return updatedClient.rows[0];
      } else {
        // Création
        const fields = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(data);
        const query = `INSERT INTO clients (${fields}) VALUES (${placeholders}) RETURNING *`;
        const newClient = await pool.query(query, values);
        return newClient.rows[0];
      }
    case 'calls':
      if (id) {
        // Mise à jour
        const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const query = `UPDATE calls SET ${fields} WHERE id = $1 RETURNING *`;
        const updatedCall = await pool.query(query, [id, ...values]);
        return updatedCall.rows[0];
      } else {
        // Création
        const fields = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(data);
        const query = `INSERT INTO calls (${fields}) VALUES (${placeholders}) RETURNING *`;
        const newCall = await pool.query(query, values);
        return newCall.rows[0];
      }
    default:
      throw new Error('Resource not supported');
  }
}

