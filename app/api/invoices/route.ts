// app/api/invoices/route.ts
import { NextResponse } from 'next/server';
import { InvoiceService } from './service';

const invoiceService = new InvoiceService;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const invoices = await invoiceService.getInvoicesByUserId(Number(userId));
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const invoiceData = await request.json();
    const newInvoice = await invoiceService.createInvoice(invoiceData);
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
