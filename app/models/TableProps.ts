import { ReactNode } from "react";

export interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => ReactNode;
  }[];
  actions?: (item: T) => ReactNode;
  emptyMessage?: string;
}