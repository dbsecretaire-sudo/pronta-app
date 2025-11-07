// app/api/Company/route.ts
import { NextResponse } from 'next/server';
import { CompanyService } from './service';

const companyService = new CompanyService;

// GET /api/services
export async function GET(request: Request) {
  try {
    const services = await companyService.getAllCompanies();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
