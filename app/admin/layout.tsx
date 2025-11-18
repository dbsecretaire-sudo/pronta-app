// src/app/admin/layout.tsx
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8">
          {children}
      </main>
    </div>
  );
}
