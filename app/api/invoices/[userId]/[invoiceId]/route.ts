import { NextResponse, NextRequest } from 'next/server';
import { InvoiceService } from "../../service";

const invoiceService = new InvoiceService();

// GET /api/invoices/[userId]/[invoiceId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string; invoiceId: string }> }
) {
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
}

// PUT /api/invoices/[userId]/[invoiceId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string; invoiceId: string }> }
) {
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
}

// DELETE /api/invoices/[userId]/[invoiceId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; invoiceId: string }> }
) {
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
}

