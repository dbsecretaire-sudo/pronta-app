// app/api/invoices/[id]/items/route.ts
import { NextResponse } from 'next/server';
import { InvoiceService } from '../../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const invoiceService = new InvoiceService;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

      const session = await getServerSession(authOptions);
    if (!session) {
       return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
    }

  try {
    const { id } = await params;
    const itemData = await request.json();
    const newItem = await invoiceService.addInvoiceItem(itemData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add invoice item" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

      const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

  try {
    const { id } = await params;
    const invoiceItems = await invoiceService.getInvoiceItems(id);
    return NextResponse.json(invoiceItems, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get invoice item" },
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
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId is required" },
        { status: 400 }
      );
    }

    await invoiceService.deleteInvoiceItem(Number(itemId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete invoice item" },
      { status: 500 }
    );
  }
}
