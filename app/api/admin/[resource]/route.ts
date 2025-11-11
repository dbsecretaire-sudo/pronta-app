import { NextResponse } from 'next/server';
import pool from '@/src/lib/db';

//app/api/admin/[resource]/route.ts
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const data = await request.json();

  try {
    if (resource === "invoices") {
      // 1. Extrait les items et calcule le montant total
      const items = data.items;

      // 2. Prépare les données pour la facture (sans les items)
      const { items: _, ...invoiceData } = data; // Exclut les items
      const invoiceFields = Object.keys(invoiceData).join(', ');
      const invoicePlaceholders = Object.keys(invoiceData)
        .map((_, i) => `$${i + 1}`)
        .join(', ');
      const invoiceValues = Object.values(invoiceData);

      // 3. Insère la facture et récupère son ID
      const invoiceQuery = `
        INSERT INTO invoices (${invoiceFields})
        VALUES (${invoicePlaceholders})
        RETURNING id
      `;
      const invoiceResult = await pool.query(invoiceQuery, [
        ...invoiceValues, // Ajoute le montant total calculé
      ]);
      const invoiceId = invoiceResult.rows[0].id;

      // 4. Insère chaque item avec l'invoice_id
      for (const item of items) {
        const itemQuery = `
          INSERT INTO invoice_items
          (invoice_id, description, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
        `;
        await pool.query(itemQuery, [
          invoiceId,
          item.description,
          item.quantity,
          item.unit_price        
        ]);
      }

      // 5. Retourne la facture créée
      const createdInvoice = await pool.query(
        'SELECT * FROM invoices WHERE id = $1',
        [invoiceId]
      );
      return NextResponse.json(createdInvoice.rows[0]);
    
    } else if (resource === "calendar"){
      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(data);
      const query = `
        INSERT INTO calendar_events (${fields})
        VALUES (${placeholders})
        RETURNING *
      `;
      const result = await pool.query(query, values);
      return NextResponse.json(result.rows[0]);
    } else if (resource === "subscriptions"){ 
      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(data);
      const query = `
        INSERT INTO user_subscriptions (${fields})
        VALUES (${placeholders})
        RETURNING *
      `;
      const result = await pool.query(query, values);
      return NextResponse.json(result.rows[0]);
    } else {
      // Logique générique pour les autres ressources
      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(data);
      const query = `
        INSERT INTO ${resource} (${fields})
        VALUES (${placeholders})
        RETURNING *
      `;
      const result = await pool.query(query, values);
      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: 'Failed to create', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  try {
    let result;
    if (resource === "subscriptions"){
      result = await pool.query(`SELECT * FROM user_subscriptions`);
    } else if (resource === "calendar") {
      result = await pool.query(`SELECT * FROM calendar_events`);
    } else {
      result = await pool.query(`SELECT * FROM ${resource}`);
    }
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}