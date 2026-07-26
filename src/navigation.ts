import {createNavigation} from 'next-intl/navigation';

export const locales = ['en', 'de', 'es'] as const;
export const localePrefix = 'as-needed';

export const defaultLocale = 'en' as const;

export const {Link, redirect, usePathname, useRouter} =
  createNavigation({locales, localePrefix, defaultLocale});
