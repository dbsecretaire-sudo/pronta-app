// app/api/invoices/client/route.ts
import { NextResponse } from 'next/server';
import { getInvoicesByClient } from '../controller';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }

    const invoices = await getInvoicesByClient(Number(clientId));
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices by client" },
      { status: 500 }
    );
  }
}
