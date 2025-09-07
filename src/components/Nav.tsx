"use client";


import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import HamburgerIcon from './icons/HamburgerIcon';

export interface NavItem {
  title: string;
  id: string;
}

interface NavProps {
  navItems?: NavItem[];
}

export const Nav = ({ navItems }: NavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const c = useTranslations('couple');

  const defaultSections: NavItem[] = [
    { title: 'Details', id: 'details' },
    { title: 'Schedule', id: 'schedule' },
    { title: t('location'), id: 'location' },
    { title: t('hotels'), id: 'hotels' },
    { title: t('arrival'), id: 'arrival' },
    { title: t('rsvp'), id: 'rsvp' },
    { title: t('excursions'), id: 'excursions' },
    { title: t('faq'), id: 'faq' },
  ];
  const sections = navItems ?? defaultSections;

  return (
    <nav className="sticky top-0 bg-white dark:bg-black shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="#hero" className="text-xl font-script">
            {c('name1')} & {c('name2')} 
            {/* {c('activity')} */}
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {sections.map(section => (
              <Link key={section.id} href={`#${section.id}`} className="hover:underline">
                {section.title}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <HamburgerIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black shadow-lg">
          <div className="flex flex-col items-center space-y-4 py-4">
            {sections.map(section => (
              <Link key={section.id} href={`#${section.id}`} className="hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                {section.title}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
};
