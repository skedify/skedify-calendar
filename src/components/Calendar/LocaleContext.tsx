import { createContext } from "react";
import { de, fr, nl } from "date-fns/locale";

const AVAILABLE_LOCALES = {
  de,
  fr,
  nl,
} as const;

const DEFAULT_LOCALE = undefined; // The default for date-fns will be english anyway

export type SupportedLocales = keyof typeof AVAILABLE_LOCALES;

function isKnownKey(locale: string): locale is SupportedLocales {
  return Object.keys(AVAILABLE_LOCALES).indexOf(locale) !== -1;
}

export function loadLocale(locale: Locale | string) {
  // Assuming that when an object is passed
  // It is a valid date-fns object
  if (typeof locale === "object" && locale !== null) {
    return locale;
  }

  // If a string is passed
  // Only one of the supported locales is used
  return isKnownKey(locale) ? AVAILABLE_LOCALES[locale] : DEFAULT_LOCALE;
}

export const LocaleContext = createContext(loadLocale("en"));
