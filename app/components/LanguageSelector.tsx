"use client";

import { localeDetails, locales, type Locale } from "../lib/locales";
import { useRouter } from "next/navigation";
import styles from "./SiteHeader.module.css";

type LanguageSelectorProps = {
  locale: Locale;
  label: string;
};

export function LanguageSelector({ locale, label }: LanguageSelectorProps) {
  const router = useRouter();

  function changeLanguage(nextLocale: string) {
    if (!locales.some((supportedLocale) => supportedLocale === nextLocale)) return;
    router.push(`/${nextLocale}${window.location.hash}`);
  }

  return (
    <label className={styles.languageSelector}>
      <span className={styles.visuallyHidden}>{label}</span>
      <select
        aria-label={label}
        value={locale}
        onChange={(event) => changeLanguage(event.currentTarget.value)}
      >
        {locales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {localeDetails[supportedLocale].displayName}
          </option>
        ))}
      </select>
    </label>
  );
}
