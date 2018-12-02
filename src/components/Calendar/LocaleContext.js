import { createContext } from 'react';

import german from 'date-fns/locale/de';
import french from 'date-fns/locale/fr';
import dutch from 'date-fns/locale/nl';

const AVAILABLE_LOCALES = {
  de: german,
  fr: french,
  nl: dutch,
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
