import { Company, CompanyModel } from "./types";

export class CompanyService {
  private companyModel = new CompanyModel({} as Company);

  async getAllCompanies(): Promise<Company[]> {
    return this.companyModel.getAllCompanies();
  }

  async getAllCompaniesName(): Promise<Record<number, { id: number; name: string; }>> {
    return this.companyModel.getAllCompaniesName();
  }
}