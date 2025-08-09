import {
  Link,
  redirect,
  usePathname,
  useRouter,
} from 'next-intl/navigation';

export const locales = ['en', 'de', 'es'] as const;
export const localePrefix = 'as-needed';

export { Link, redirect, usePathname, useRouter };
