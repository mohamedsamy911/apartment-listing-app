import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { JSX } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apartment listing app",
  description: "List your apartment for sale",
};

/**
 * RootLayout Component
 *
 * The root layout component that wraps the entire application.
 * It sets the global font styles and renders the ClientLayout component.
 *
 * @component
 * @param props - The props object containing the children elements
 * @param props.children - The children elements to be rendered inside the layout
 * @returns {JSX.Element} The root layout component with global font styles and ClientLayout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
