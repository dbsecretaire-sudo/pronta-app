// components/AuthWrapper.tsx
"use client";
import { useAuth } from "@/app/hook/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const dynamic = 'force-dynamic';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  useAuth();
  return <>{children}</>;
}
