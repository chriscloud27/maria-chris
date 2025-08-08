'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useTransition, useState, useRef, useEffect } from 'react';
import UKFlag from './icons/UKFlag';
import DEFlag from './icons/DEFlag';
import ESFlag from './icons/ESFlag';

const localeDetails = {
  en: { name: 'EN', Flag: UKFlag },
  de: { name: 'DE', Flag: DEFlag },
  es: { name: 'ES', Flag: ESFlag },
};

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

  const { Flag: CurrentFlag } = localeDetails[locale];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"
        disabled={isPending}
      >
        <CurrentFlag />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {Object.keys(localeDetails).map((key) => {
              const { name, Flag } = localeDetails[key as 'en' | 'de' | 'es'];
              return (
                <button
                  key={key}
                  onClick={() => onSelectChange(key as 'en' | 'de' | 'es')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <Flag />
                  <span className="ml-3">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
