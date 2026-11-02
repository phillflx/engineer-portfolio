"use client";

import { useEffect, useRef, useState } from "react";
import { localeDetails, locales, type Locale } from "../lib/locales";
import { useRouter } from "next/navigation";
import styles from "./SiteHeader.module.css";

type LanguageSelectorProps = {
  locale: Locale;
  label: string;
};

export function LanguageSelector({ locale, label }: LanguageSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function changeLanguage(nextLocale: string) {
    if (!locales.some((supportedLocale) => supportedLocale === nextLocale)) return;
    router.push(`/${nextLocale}${window.location.hash}`);
    setIsOpen(false);
  }

  return (
    <div className={styles.languageSelector} ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.languageTrigger}
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls="language-options"
        onClick={() => setIsOpen((open) => !open)}
      >
        {localeDetails[locale].displayName}
        <span aria-hidden="true">⌄</span>
      </button>
      {isOpen ? (
        <div
          className={styles.languageOptions}
          id="language-options"
          role="group"
          aria-label={label}
        >
          {locales.map((supportedLocale) => (
            <button
              key={supportedLocale}
              type="button"
              aria-current={locale === supportedLocale ? "true" : undefined}
              onClick={() => changeLanguage(supportedLocale)}
            >
              {localeDetails[supportedLocale].displayName}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
