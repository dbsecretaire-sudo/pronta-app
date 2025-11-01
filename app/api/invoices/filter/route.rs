// app/api/invoices/filter/route.ts
import { NextResponse } from "next/server";
import { filterInvoices } from "../controller";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());
    const invoices = await filterInvoices(filters);
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to filter invoices" },
      { status: 500 }
    );
  }
}
