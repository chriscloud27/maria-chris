// src/i18n.ts
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'de', 'es'] as const;

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;              // vom System ermittelt
  if (!locales.includes(locale as any)) notFound(); // Guard

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});