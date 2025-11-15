import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "../src/context/providers";
import { StrictMode } from 'react';

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
          {children}
      </body>
    </html>
  );
}