export const locales = ["en", "pt-BR"] as const;

export type Locale = (typeof locales)[number];

export const localeDetails: Record<
  Locale,
  { displayName: string; documentLanguage: string }
> = {
  en: {
    displayName: "English",
    documentLanguage: "en",
  },
  "pt-BR": {
    displayName: "Português (Brasil)",
    documentLanguage: "pt-BR",
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some((locale) => locale === value);
}
