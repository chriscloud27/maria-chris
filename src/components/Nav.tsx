"use client";


import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Heart } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import HamburgerIcon from './icons/HamburgerIcon';

export interface NavItem {
  title: string;
  id?: string;
  href?: string;
}

interface NavProps {
  navItems?: NavItem[];
  isCountdownFinished?: boolean;
}

export const Nav = ({ navItems, isCountdownFinished = false }: NavProps) => {
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
  const allSections = navItems ?? defaultSections;
  
  // Filter sections based on countdown status
  // Before countdown: hide destinations, media
  // After countdown: hide attire, location, hotels, arrival, rsvp
  const sections = isCountdownFinished 
    ? allSections.filter(item => !(item.id && ['attire', 'hotels', 'location', 'arrival', 'rsvp'].includes(item.id)))
    : allSections.filter(item => !(item.id && ['destinations', 'media'].includes(item.id)));

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/60 backdrop-blur-md border-b border-gray-200/20 shadow-sm hover:shadow-md transition-all duration-300 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/#hero" className="text-xl font-script flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            {c('name1')} & {c('name2')} 
            {/* {c('activity')} */}
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {sections.map(section => (
              <Link 
                key={section.id || section.href} 
                href={section.href || `#${section.id}`} 
                className={(section.id === 'rsvp' || (section.id === 'media' && isCountdownFinished))
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/20 shadow-lg">
          <div className="flex flex-col items-center space-y-4 py-4">
            {sections.map(section => (
              <Link 
                key={section.id || section.href} 
                href={section.href || `#${section.id}`} 
                className={(section.id === 'rsvp' || (section.id === 'media' && isCountdownFinished))
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
