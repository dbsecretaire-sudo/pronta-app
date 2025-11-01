// app/api/invoices/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { updateInvoiceStatus } from '../../controller';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const updatedInvoice = await updateInvoiceStatus(Number(id), status);
    return NextResponse.json(updatedInvoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update invoice status" },
      { status: 500 }
    );
  }
}
