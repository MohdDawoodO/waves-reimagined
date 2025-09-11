import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Nav from "@/components/navigation/nav";
import { SessionProvider } from "next-auth/react";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interFont = Inter({
  variable: "--font-inter-mono",
  subsets: ["latin"],
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
          <div className="px-4 md:px-12 lg:px-16 mx-auto max-w-8xl">
            <Nav />
            <SessionProvider>{children}</SessionProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
