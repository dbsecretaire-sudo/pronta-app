import { ReactNode } from 'react';

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => ReactNode;
  className?: string; // ✅ Ajout pour personnaliser les cellules
  headerClassName?: string; // ✅ Ajout pour personnaliser les en-têtes
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: (item: T) => ReactNode;
  emptyMessage?: string | ReactNode; // ✅ Support pour ReactNode
  className?: string; // ✅ Pour personnaliser le conteneur
  tableClassName?: string; // ✅ Pour personnaliser la table
  rowClassName?: (item: T, index: number) => string; // ✅ Pour personnaliser les lignes
}