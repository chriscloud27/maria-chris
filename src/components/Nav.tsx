"use client";


import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Heart } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md border-b border-gray-200/10 shadow-sm hover:shadow-md transition-all duration-300 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="#hero" className="text-xl font-script flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            {c('name1')} & {c('name2')} 
            {/* {c('activity')} */}
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {sections.map(section => (
              <Link 
                key={section.id} 
                href={`#${section.id}`} 
                className={section.id === 'rsvp' 
                  ? "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50" 
                  : "hover:underline"
                }
              >
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
        <div className="md:hidden absolute top-full left-0 w-full bg-transparent backdrop-blur-md border-b border-gray-200/10 shadow-lg">
          <div className="flex flex-col items-center space-y-4 py-4">
            {sections.map(section => (
              <Link 
                key={section.id} 
                href={`#${section.id}`} 
                className={section.id === 'rsvp' 
                  ? "bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50" 
                  : "hover:underline"
                } 
                onClick={() => setIsMobileMenuOpen(false)}
              >
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
