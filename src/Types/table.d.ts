// src/types/table.d.ts
import { ColumnDef, TableMeta, ColumnMeta } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // interface ColumnDef<TData, TValue> {
  //   meta?: {
  //     sortable?: boolean;
  //     type?: 'text' | 'userName' | 'typeBadge' | 'date' | 'duration' | 'booleanBadge';
  //     filterType?: 'text' | 'select' | 'date' | 'duration';
  //     dataMap?: string;
  //     typeData?: Record<string, { label: string; color: string }>;
  //     filterOptions?: Array<{ value: string; label: string }>;
  //   };
  // }

  interface TableMeta<TData> {
    dataMaps?: Record<string, Record<number, { name: string; [key: string]: any }>>;
  }

    interface ColumnMeta<TData, TValue> {
        type?: 'text' | 'userName' | 'typeBadge' | 'date' | 'duration' | 'booleanBadge';
        dataMap?: string;
        typeData?: Record<string, TypeBadgeInfo>;
        filterOptions?: Array<{ value: string; label: string }>;
        filterType?: 'text' | 'select' | 'date' | 'duration';
        sortable?: boolean;
    
    }

}