import { createContext } from 'react';

import { nl, fr, de } from 'date-fns/locale';

const AVAILABLE_LOCALES = {
  de,
  fr,
  nl,
};

const DEFAULT_LOCALE = undefined; // The default for date-fns will be english anyway

export function loadLocale(locale) {
  // Assuming that when an object is passed
  // It is a valid date-fns object
  if (typeof locale === 'object' && locale !== null) {
    return locale;
  }

  if (Object.keys(AVAILABLE_LOCALES).indexOf(locale) === -1) {
    return DEFAULT_LOCALE;
  }

  // If a string is passed
  // Only one of the supported locales is used
  return AVAILABLE_LOCALES[locale];
}

export const LocaleContext = createContext(loadLocale('en'));
