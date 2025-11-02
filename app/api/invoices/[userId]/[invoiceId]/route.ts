// // app/api/invoices/[userId]/[invoiceId]/route.ts
// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';
// import pool from "@/src/lib/db";

// // Interface pour les paramètres de route - doit correspondre exactement aux noms des dossiers
// interface RouteParams {
//   userId: string;
//   invoiceId: string;  // Doit correspondre exactement au nom du dossier [invoiceId]
// }

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string; invoiceId: string }> }
// ) {
//   try {
//     const { userId, invoiceId } = await params;

//     if (!userId || isNaN(Number(userId)) || !invoiceId || isNaN(Number(invoiceId))) {
//       return NextResponse.json(
//         { error: "Invalid user ID or invoice ID" },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();
//     const result = await client.query(
//       `SELECT id, date, amount, status, pdf_url, user_id
//        FROM invoices
//        WHERE id = $1 AND user_id = $2`,
//       [invoiceId, userId]
//     );
//     client.release();

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Invoice not found or doesn't belong to user" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(result.rows[0]);
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string; invoiceId: string }> }
// ) {
//   try {
//     const { userId, invoiceId } = await params;
//     const body = await request.json();

//     if (!userId || isNaN(Number(userId)) || !invoiceId || isNaN(Number(invoiceId))) {
//       return NextResponse.json(
//         { error: "Invalid user ID or invoice ID" },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();
//     const fields: string[] = [];
//     const values: any[] = [];
//     let paramIndex = 1;

//     if (body.date !== undefined) {
//       fields.push(`date = $${paramIndex}`);
//       values.push(new Date(body.date));
//       paramIndex++;
//     }

//     if (body.amount !== undefined) {
//       fields.push(`amount = $${paramIndex}`);
//       values.push(body.amount);
//       paramIndex++;
//     }

//     if (body.status !== undefined) {
//       fields.push(`status = $${paramIndex}`);
//       values.push(body.status);
//       paramIndex++;
//     }

//     if (body.pdf_url !== undefined) {
//       fields.push(`pdf_url = $${paramIndex}`);
//       values.push(body.pdf_url);
//       paramIndex++;
//     }

//     if (fields.length === 0) {
//       return NextResponse.json(
//         { error: "No fields to update" },
//         { status: 400 }
//       );
//     }

//     values.push(invoiceId, userId);

//     const result = await client.query(
//       `UPDATE invoices
//        SET ${fields.join(', ')}
//        WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
//        RETURNING *`,
//       [...values, invoiceId, userId]
//     );
//     client.release();

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Invoice not found or doesn't belong to user" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(result.rows[0]);
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string; invoiceId: string }> }
// ) {
//   try {
//     const { userId, invoiceId } = await params;

//     if (!userId || isNaN(Number(userId)) || !invoiceId || isNaN(Number(invoiceId))) {
//       return NextResponse.json(
//         { error: "Invalid user ID or invoice ID" },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();
//     const result = await client.query(
//       `DELETE FROM invoices
//        WHERE id = $1 AND user_id = $2
//        RETURNING id`,
//       [invoiceId, userId]
//     );
//     client.release();

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Invoice not found or doesn't belong to user" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Invoice deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
