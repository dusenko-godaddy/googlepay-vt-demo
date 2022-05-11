import { createIntl, createIntlCache } from 'react-intl';

import enUS from "../../localization/messages/en-US.json";
import enCA from "../../localization/messages/en-CA.json";

const messages: Record<string, Record<string, string>> = {
  "en": enUS,
  "en-US": enUS,
  "en-CA": enCA,
};

const cache = createIntlCache();

export const DEFAULT_LOCALE = "en-US";

export const getMessages = (locale: string) => {
  return messages[locale] ? messages[locale] : messages[DEFAULT_LOCALE];
};

export const getLocale = (locale?: string) => {
  const foundLocale = locale || window.navigator?.language || DEFAULT_LOCALE;

  return messages[foundLocale] ? foundLocale : DEFAULT_LOCALE;
};

export const getIntl = (locale?: string) => {
  return createIntl({
    locale: getLocale(locale || DEFAULT_LOCALE),
    defaultLocale: DEFAULT_LOCALE,
    messages: getMessages(locale || DEFAULT_LOCALE),
  }, cache);
};
