"use client";
import { useAuth } from '@/app/hook/useAuth';

export default function DashboardPage() {
  useAuth();

  return <div>Contenu du tableau de bord</div>;
}
