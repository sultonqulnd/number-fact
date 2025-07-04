export const locales = ["en", "ru", "uz"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "O'zbekcha",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  ru: "🇷🇺",
  uz: "🇺🇿",
};
