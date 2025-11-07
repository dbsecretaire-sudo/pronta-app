import { NextResponse } from 'next/server';
import { CompanyService } from '../service';

const companyService = new CompanyService;

// GET /api/user
export async function GET(request: Request) {
  try {
    const companies = await companyService.getAllCompaniesName();
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}