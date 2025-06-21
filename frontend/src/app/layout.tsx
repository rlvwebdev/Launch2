/**
 * Launch Transportation Management Platform
 * Copyright (c) 2025 Robert Vassallo. All rights reserved.
 * This software is proprietary and confidential.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProfessionalLayout from "@/components/layout/ProfessionalLayout";
import { DataProvider } from "@/context/DataContext";
import { OrganizationalProvider } from "@/context/OrganizationalContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import { TerminalProvider } from "@/context/TerminalContext";
import { RouteProtection } from "@/components/auth/RouteProtection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Launch - Terminal Ops",
  description: "Mobile-first web application for managing transportation operations including drivers, trucks, and loads. Propelling the logistics industry forward.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}      >        <ThemeProvider>
          <AuthProvider>
            <RouteProtection>
              <TerminalProvider>
                <SettingsProvider>
                  <OrganizationalProvider>
                    <DataProvider>
                      <SearchProvider>
                      <ProfessionalLayout>
                        {children}
                      </ProfessionalLayout>                      </SearchProvider>
                    </DataProvider>
                  </OrganizationalProvider>
                </SettingsProvider>
              </TerminalProvider>
            </RouteProtection>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
