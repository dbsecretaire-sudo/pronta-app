// src/types/table.d.ts
import { ColumnDef, TableMeta, ColumnMeta } from '@tanstack/react-table';
import { ColumnMeta, TableMeta } from './table.d';

export type ExtendedColumnDef<TData> = ColumnDef<TData, any> & {
  meta?: ColumnMeta<TData, any>;
};

declare module '@tanstack/react-table' {

  interface TableMeta<TData> {
    dataMaps?: Record<string, Record<number, { name: string; [key: string]: any }>>;
  }

    interface ColumnMeta<TData, TValue> {
        type?: 'text' | 'userName' | 'typeBadge' | 'date' | 'duration' | 'booleanBadge' | 'array';
        dataMap?: string;
        typeData?: Record<string, TypeBadgeInfo>;
        filterOptions?: Array<{ value: string; label: string }>;
        filterType?: 'text' | 'select' | 'date' | 'duration' | 'array';
        sortable?: boolean;
    
    }

}