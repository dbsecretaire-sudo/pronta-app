import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";

export const dynamic = 'force-dynamic';

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default async function RootLayout({ children }: {children: React.ReactNode}) {
 
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;

  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider accessToken={accessToken} session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}