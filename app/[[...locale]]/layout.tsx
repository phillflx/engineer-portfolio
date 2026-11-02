import type { ReactNode } from "react";
import { isLocale } from "../lib/locales";
import "../globals.css";

type RootLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale?: string[] }>;
}>;

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const routeLocale = locale?.[0];
  const documentLanguage = isLocale(routeLocale) ? routeLocale : "en";

  return (
    <html lang={documentLanguage} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
