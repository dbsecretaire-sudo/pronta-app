import { NextResponse } from 'next/server';
import pool from '@/src/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL;
export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string, id: string }> }
) {

  const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

  const { resource, id } = await params;
  try {
    let result;
    if (resource === "subscriptions"){
      result = await pool.query(`SELECT * FROM user_subscriptions WHERE id = $1`, [id]);
    } else if (resource === "calendar") {
      result = await pool.query(`SELECT * FROM calendar_events WHERE id = $1`, [id]);
    } else {
      result = await pool.query(`SELECT * FROM ${resource} WHERE id = $1`, [id]);
    }
    
    return NextResponse.json(result.rows[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {

  const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

  const { resource, id } = await params;
  const data = await request.json();
  try {
    if (resource === "invoices") {
      // 1. Met à jour la facture
      const { items, ...invoiceData } = data;

      // 3. Met à jour la facture dans la base de données
      const invoiceFields = Object.keys(invoiceData)
        .map((key, i) => `${key} = $${i + 2}`)
        .join(', ');
      const invoiceValues = [id, ...Object.values(invoiceData)];
      // 4. Requête pour mettre à jour la facture
      const updateInvoiceQuery = `
      UPDATE invoices
      SET ${invoiceFields}
      WHERE id = $1
      RETURNING *
      `;
      
      await pool.query(updateInvoiceQuery, invoiceValues);

      if(items.length !== 0){
         // 5. Supprime les anciens items
        await pool.query(
          'DELETE FROM invoice_items WHERE invoice_id = $1',
          [id]
        );

        // 6. Insère les nouveaux items
        for (const item of items) {
          await pool.query(
            `INSERT INTO invoice_items
            (invoice_id, description, quantity, unit_price)
            VALUES ($1, $2, $3, $4)`,
            [
              id,
              item.description,
              item.quantity,
              item.unit_price,
            ]
          );
        }
      }
     
      return NextResponse.json({message: 'success'});
    } else if (resource === "calendar"){
      const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 2}`)
        .join(', ');

      const values = [id, ...Object.values(data)];

      const query = `
        UPDATE calendar_events
        SET ${fields}
        WHERE id = $1
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return NextResponse.json(result.rows[0]);
    } else if (resource === "subscriptions"){
      const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 2}`)
        .join(', ');

      const values = [id, ...Object.values(data)];

      const query = `
        UPDATE user_subscriptions
        SET ${fields}
        WHERE id = $1
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return NextResponse.json(result.rows[0]);
    } else {
      // Logique générique pour les autres ressources
      const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 2}`)
        .join(', ');

      const values = [id, ...Object.values(data)];

      const query = `
        UPDATE ${resource}
        SET ${fields}
        WHERE id = $1
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to update',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}