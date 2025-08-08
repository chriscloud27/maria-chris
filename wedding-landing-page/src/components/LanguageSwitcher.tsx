'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useTransition, useState, useRef, useEffect } from 'react';
import DEFlag from './icons/DEFlag';
import ESFlag from './icons/ESFlag';
import USFlag from './icons/USFlag';

const locales: { code: 'en' | 'de' | 'es'; name: string; flag: React.ComponentType<React.SVGProps<SVGSVGElement>>; }[] = [
  { code: 'en', name: 'English', flag: USFlag },
  { code: 'de', name: 'Deutsch', flag: DEFlag },
  { code: 'es', name: 'Español', flag: ESFlag },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const locale = useLocale() as 'en' | 'de' | 'es';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function onSelectChange(nextLocale: 'en' | 'de' | 'es') {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const currentLocale = locales.find(l => l.code === locale);
  const CurrentFlag = currentLocale?.flag;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"
        disabled={isPending}
      >
        {CurrentFlag && <CurrentFlag className="w-6 h-auto" />}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {locales.map(({ code, name, flag: Flag }) => {
              return (
                <button
                  key={code}
                  onClick={() => onSelectChange(code)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <Flag className="w-5 h-auto mr-3" />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
