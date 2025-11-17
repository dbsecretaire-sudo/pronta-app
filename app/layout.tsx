import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React from "react";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default async function RootLayout({ children }: {children: React.ReactNode}) {
 
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
         {children}
      </body>
    </html>
  );
}