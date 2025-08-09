import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'de', 'es'] as const;

function isValidLocale(locale: unknown): locale is typeof locales[number] {
  return typeof locale === 'string' && locales.includes(locale as any);
}

export default getRequestConfig(async ({ locale }) => {
  if (!isValidLocale(locale)) notFound();
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
