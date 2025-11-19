import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import { AuthProvider } from "@/src/context/authContext";
import { getServerToken } from "@/src/lib/auth";
import { getSession } from "next-auth/react";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default async function RootLayout({ children }: {children: React.ReactNode}) {
 
  const session = await getSession();

  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider accessToken={null} session={session} >
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}