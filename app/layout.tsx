import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Nav from "@/components/navigation/nav";
import { SessionProvider } from "next-auth/react";
import AppSidebarProvider from "@/components/providers/sidebar-provider";
import { Toaster } from "@/components/ui/sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interFont = Inter({
  variable: "--font-inter-mono",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "Waves Music",
  description: "Online Music Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interFont.className} ${geistMono.variable} antialiased`}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppSidebarProvider>
            <main className="px-4 md:px-6 py-4 pt-0 mx-auto w-full h-[100vh] overflow-y-auto">
              <Nav />
              <SessionProvider>{children}</SessionProvider>
            </main>
            <Toaster richColors />
          </AppSidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
