import { Company } from "./type";
import pool from "@/src/lib/db";

export class CompanyModel {
    constructor(public data: Company) {}

    async getAllCompanies() : Promise<Company[]>{
        const res = await pool.query(
            'SELECT * FROM companies ORDER BY name'
        );
        return res.rows;
    }

    async getAllCompaniesName(): Promise<Record<number, { id: number; name: string }>> {
    const query = `
      SELECT id, name
      FROM companies
      ORDER BY created_at DESC
    `;
    const res = await pool.query(query);
    // Crée une map { id: { id, name } } pour un accès rapide
    return res.rows.reduce((acc: Record<number, { id: number; name: string }>, company) => {
      acc[company.id] = company;
      return acc;
    }, {});
  }
}