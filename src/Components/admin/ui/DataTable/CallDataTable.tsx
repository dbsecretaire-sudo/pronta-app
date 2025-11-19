// src/Components/CallDataTable.tsx
"use client";
import { DataTableUi } from "./DataTableUi";

interface UserMap {
  [id: number]: { id: number; name: string };
}

interface CallDataTableProps<T extends { id: number }> {
  data: T[];
  columns: any[];
  resourceName: string;
  createHref: string;
  onDelete?: (id: string | number) => void;
  dataMaps?: Record<string, UserMap>;
  accessToken: {} | string | null;
}

export function CallDataTable({
  data,
  columns,
  resourceName,
  createHref,
  onDelete,
  dataMaps = {},
  accessToken = null
}: CallDataTableProps<any>) {
  return (
    <DataTableUi
      data={data}
      columns={columns}
      resourceName={resourceName}
      createHref={createHref}
      onDelete={onDelete}
      dataMaps={dataMaps}
      accessToken={accessToken}
    />
  );
}
