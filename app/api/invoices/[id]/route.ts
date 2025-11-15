// app/api/invoices/[id]/route.ts
import { NextResponse } from 'next/server';
import { InvoiceService } from '../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const invoiceService = new InvoiceService;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

      const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));  
    }

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
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

      const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

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
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

      const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

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
}
