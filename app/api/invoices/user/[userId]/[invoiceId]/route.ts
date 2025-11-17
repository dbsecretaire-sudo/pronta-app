import { NextResponse, NextRequest } from 'next/server';
import { InvoiceService } from "../../../service";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const invoiceService = new InvoiceService();

// GET /api/invoices/[userId]/[invoiceId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; invoiceId: string }> }
) {
  return withAuth(request, async (session) => {
    try {
      const { userId, invoiceId } = await params;

      if (!userId) {
        return NextResponse.json(
          { error: "userId is required" },
          { status: 400 }
        );
      }

      const invoice = await invoiceService.getInvoiceById(Number(invoiceId));
      return NextResponse.json(invoice);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch invoice" },
        { status: 500 }
      );
    }
  });
}

// PUT /api/invoices/[userId]/[invoiceId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; invoiceId: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { userId, invoiceId } = await params;
      const body = await request.json();

      if (!userId) {
        return NextResponse.json(
          { error: "userId is required" },
          { status: 400 }
        );
      }

      const invoice = await invoiceService.updateInvoice(Number(invoiceId), body);
      return NextResponse.json(invoice);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update invoice" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/invoices/[userId]/[invoiceId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; invoiceId: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { userId, invoiceId } = await params;

      if (!userId) {
        return NextResponse.json(
          { error: "userId is required" },
          { status: 400 }
        );
      }

      const invoice = await invoiceService.deleteInvoice(Number(invoiceId));
      return NextResponse.json(invoice);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete invoice" },
        { status: 500 }
      );
    }
  });
}

