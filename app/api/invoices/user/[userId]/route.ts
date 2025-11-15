// app/api/invoices/[userId]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { InvoiceService } from "../../service";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const invoiceService = new InvoiceService;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {  
  
      const session = await getServerSession(authOptions);
    if (!session) {
       return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
    }
  
  try {
  const { userId } = await params;

  const invoice = await invoiceService.getInvoicesByUserId(Number(userId));
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// // POST /api/invoices/[userId]
// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string }> }
// ) {
//   try {
//     const { userId } = await params;
//     const body = await request.json();

//     if (!userId || isNaN(Number(userId))) {
//       return NextResponse.json(
//         { error: "Invalid user ID" },
//         { status: 400 }
//       );
//     }

//     // Validation des données
//     if (!body.date || !body.amount) {
//       return NextResponse.json(
//         { error: "Date and amount are required" },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();
//     const result = await client.query(
//       `INSERT INTO invoices
//        (user_id, date, amount, status, pdf_url)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING *`,
//       [
//         userId,
//         new Date(body.date),
//         body.amount,
//         body.status || 'pending',
//         body.pdf_url || null
//       ]
//     );
//     client.release();

//     return NextResponse.json(result.rows[0], { status: 201 });
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
