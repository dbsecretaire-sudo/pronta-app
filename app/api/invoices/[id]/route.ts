// app/api/invoices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const invoiceService = new InvoiceService;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      const invoice = await invoiceService.getInvoiceById(Number(id));

      if (!invoice) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(invoice);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch invoice" },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      const invoiceData = await request.json();
      const updatedInvoice = await invoiceService.updateInvoice(Number(id), invoiceData);
      return NextResponse.json(updatedInvoice);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update invoice" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      await invoiceService.deleteInvoice(Number(id));
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete invoice" },
        { status: 500 }
      );
    }
  });
}
