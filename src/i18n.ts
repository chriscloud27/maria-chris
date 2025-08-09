import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
const locales = ['en', 'de', 'es'] as const;
 
function isValidLocale(locale: any): locale is typeof locales[number] {
  return locales.includes(locale);
}
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) {
    notFound();
  }
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
