// app/api/invoices/[id]/items/route.ts
import { NextResponse } from 'next/server';
import { addInvoiceItem, deleteInvoiceItem } from '../../controller';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemData = await request.json();
    const newItem = await addInvoiceItem(Number(params.id), itemData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add invoice item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId is required" },
        { status: 400 }
      );
    }

    await deleteInvoiceItem(Number(params.id), Number(itemId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete invoice item" },
      { status: 500 }
    );
  }
}
