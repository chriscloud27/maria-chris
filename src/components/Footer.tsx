"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Heart } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export interface FooterNavItem {
  title: string;
  id: string;
}

interface FooterProps {
  navItems?: FooterNavItem[];
}

export const Footer = ({ navItems }: FooterProps) => {
  const t = useTranslations('nav');
  const c = useTranslations('couple');
  const h = useTranslations('hero');
  const f = useTranslations('footer');

  const defaultSections: FooterNavItem[] = [
    { title: t('story'), id: 'story' },
    { title: t('details'), id: 'details' },
    { title: t('schedule'), id: 'schedule' },
    { title: t('location'), id: 'location' },
    { title: t('hotels'), id: 'hotels' },
    { title: t('rsvp'), id: 'rsvp' },
    { title: t('faq'), id: 'faq' },
  ];

  const sections = navItems ?? defaultSections;

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/20 mt-20 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          {/* Left: Wedding Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <Heart className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-lg font-script text-gray-800">
                {c('name1')} & {c('name2')}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {h('subtitle')} - {h('location')}
            </p>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {sections.map((section) => (
              <Link 
                key={section.id}
                href={`#${section.id}`} 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {section.title}
              </Link>
            ))}
          </div>

          {/* Right: Language Switcher */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>

        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
            <p className="text-xs text-gray-500">
              {f('copyright', {
                year: new Date().getFullYear(),
                name1: c('name1'),
                name2: c('name2'),
              })}
            </p>
        </div>

      </div>
    </footer>
  );
};