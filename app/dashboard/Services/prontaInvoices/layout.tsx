import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function ProntaInvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const currentSession = await getServerSession(authOptions);
  const accessToken = currentSession?.accessToken ?? null;

  return (
    <>
      {/* Barre de retour spécifique */}
      <nav className="bg-white border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600 flex items-center">
              ← Retour
            </Link>
            <div className="text-xl font-semibold text-gray-800">
              Pronta Invoices
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-4">
        <AuthProvider accessToken={accessToken} session={null}>
          {children}
        </AuthProvider>
      </div>
    </>
  );
}
