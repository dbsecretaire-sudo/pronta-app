// app/api/invoices/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '../../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const invoiceService = new InvoiceService;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      const { status } = await request.json();
      const updatedInvoice = await invoiceService.updateInvoiceStatus(Number(id), status);
      return NextResponse.json(updatedInvoice);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update invoice status" },
        { status: 500 }
      );
    }
  });
}
