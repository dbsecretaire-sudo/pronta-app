// app/api/invoices/route.ts
import { NextResponse } from 'next/server';
import { InvoiceService } from './service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const invoiceService = new InvoiceService;

export async function GET(request: Request) {

      const session = await getServerSession(authOptions);
    if (!session) {
       return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
    }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      const invoices = await invoiceService.getAllInvoices();
      return NextResponse.json(invoices);
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

    const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

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
