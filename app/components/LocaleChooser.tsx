"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LocaleChooser() {
  const router = useRouter();

  useEffect(() => {
    const primaryLanguage =
      navigator.languages?.[0] ?? navigator.language ?? "en";
    const locale = primaryLanguage.toLowerCase().startsWith("pt")
      ? "pt-BR"
      : "en";

    router.replace(`/${locale}`);
  }, [router]);

  return (
    <main className="localeChooser">
      <h1>Choose your language</h1>
      <p>Select a language to view the portfolio.</p>
      <nav className="localeChooser__links" aria-label="Available languages">
        <Link href="/en" lang="en">English</Link>
        <Link href="/pt-BR" lang="pt-BR">Português (Brasil)</Link>
      </nav>
    </main>
  );
}
