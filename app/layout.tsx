import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { getLocaleDir } from "@/lib/i18n/locales";
import { getLocaleFromServerRequest } from "@/lib/i18n/request";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apparel Online Store - Fashion for Everyone",
  description: "Discover the latest fashion trends and shop quality apparel online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocaleFromServerRequest();

  return (
    <html lang={locale} dir={getLocaleDir(locale)}>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
