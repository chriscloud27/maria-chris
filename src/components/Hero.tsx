import React from 'react';
import {useTranslations} from 'next-intl';
import Countdown from './Countdown';
import { HeroShell } from './HeroShell';

interface HeroProps {
  onCountdownFinish?: () => void;
}

export const Hero = ({ onCountdownFinish }: HeroProps = {}) => {
  const t = useTranslations('hero');
  const c = useTranslations('couple');

  return (
    <HeroShell id="hero">
      {/* Names Section - Script font for elegance */}
      <h1 className="font-script font-normal text-5xl md:text-6xl lg:text-7xl mb-4 text-center leading-tight">
        {c('name1')} & {c('name2')}
      </h1>

      {/* Title */}
      <p className="font-heading text-lg md:text-xl tracking-[0.1em] text-muted-foreground mb-12">
        {t('title')}
      </p>
      {/* Countdown Timer */}
        <Countdown targetDate="2026-08-08T14:00:00" onCountdownFinish={onCountdownFinish} />

        {/* Date Section - Elegant invitation style */}
      <div className="text-center mb-8">
        <p className="font-heading text-xl md:text-2xl tracking-[0.3em] uppercase mb-4">{t('month')}</p>
        <div className="border-t border-b border-foreground py-6 px-12 mb-4">
          <p className="font-script text-4xl md:text-5xl">{t('days')}</p>
        </div>
        <p className="font-heading text-lg md:text-xl tracking-[0.2em]">{t('year')}</p>
      </div>

      {/* Location Section - Formal typography */}
      <div className="text-center max-w-md">
        <p className="font-heading text-base md:text-lg tracking-[0.15em] uppercase">
          {t('location')}
        </p>
      </div>
    </HeroShell>
  );
}