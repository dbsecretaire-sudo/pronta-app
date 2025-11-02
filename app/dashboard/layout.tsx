// src/app/dashboard/layout.tsx
import { AppLayout } from "@/src/Components";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
