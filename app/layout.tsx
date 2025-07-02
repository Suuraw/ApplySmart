import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import GridBackground from "@/components/grid-background";
import FloatingElements from "@/components/floating-elements";
import { AuthProvider } from "@/hooks/authContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeFix",
  description: "ATS score calculator and job form automation tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="ats-theme-preference"
        >
          <AuthProvider>
            <GridBackground />
            <FloatingElements />
            <div className="bg-background text-foreground min-h-screen flex flex-col">
              <Navbar />
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
