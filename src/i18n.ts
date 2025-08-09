import {notFound} from 'next/navigation';
import {getRequestConfig, requestLocale} from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'de', 'es'];

export default getRequestConfig(async () => {
  const locale = await requestLocale(locales);
  if (!locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
