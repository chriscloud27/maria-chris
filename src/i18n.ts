// src/i18n.ts
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';


const locales = ['en', 'de', 'es'] as const;
type Locale = typeof locales[number];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({requestLocale}) => {

  const locale = await requestLocale; // vom System ermittelt
  if (typeof locale !== 'string' || !isLocale(locale)) notFound(); // Guard

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'America/Bogota'
  };
});