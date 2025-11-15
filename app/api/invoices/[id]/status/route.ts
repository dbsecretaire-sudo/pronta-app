// app/api/invoices/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { InvoiceService } from '../../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const invoiceService = new InvoiceService;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

    const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

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
}
