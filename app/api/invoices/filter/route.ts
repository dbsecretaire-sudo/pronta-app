// app/api/invoices/filter/route.ts
import { NextResponse } from "next/server";
import { filterInvoices } from "../controller";
import { InvoiceFilter, InvoiceStatus } from "@/app/Types/Invoices";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Extraire les paramètres
    const userId = searchParams.get("userId");
    const clientId = searchParams.get("clientId");
    const clientName = searchParams.get("clientName");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 2. Valider les paramètres
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const filters: InvoiceFilter = {
      userId: Number(userId),
    };

    if (clientId) {
      filters.clientId = Number(clientId);
      if (isNaN(filters.clientId)) {
        return NextResponse.json(
          { error: "clientId must be a valid number" },
          { status: 400 }
        );
      }
    }

    if (clientName) {
      filters.clientName = clientName;
    }

    if (status && ["draft", "sent", "paid", "overdue"].includes(status)) {
      filters.status = status as InvoiceStatus;
    } else if (status) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    if (startDate) {
      filters.startDate = new Date(startDate);
      if (isNaN(filters.startDate.getTime())) {
        return NextResponse.json(
          { error: "startDate must be a valid ISO date string" },
          { status: 400 }
        );
      }
    }

    if (endDate) {
      filters.endDate = new Date(endDate);
      if (isNaN(filters.endDate.getTime())) {
        return NextResponse.json(
          { error: "endDate must be a valid ISO date string" },
          { status: 400 }
        );
      }
    }

    console.log(filters);

    // 3. Appeler le contrôleur
    const invoices = await filterInvoices(filters);

    // 4. Retourner la réponse
    return NextResponse.json(invoices);

  } catch (error) {
    console.error("Error filtering invoices:", error);
    return NextResponse.json(
      { error: "Failed to filter invoices" },
      { status: 500 }
    );
  }
}
