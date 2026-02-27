import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buscolegio — Encuentra el colegio ideal para tu familia",
  description:
    "Compara colegios de todo Chile por tipo, nivel educacional, ubicación y mensualidad. Municipal, subvencionado y particular.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buscolegio.com'),
  openGraph: {
    title: "Buscolegio — Encuentra el colegio ideal para tu familia",
    description: "Compara colegios de todo Chile por tipo, nivel educacional, ubicación y mensualidad.",
    url: '/',
    siteName: 'Buscolegio',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Buscolegio — Encuentra el colegio ideal para tu familia",
    description: "Compara colegios de todo Chile por tipo, nivel educacional, ubicación y mensualidad.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
