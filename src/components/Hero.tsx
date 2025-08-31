import React from 'react';
import {useTranslations} from 'next-intl';
import Image from 'next/image';

export const Hero = () => {
  const t = useTranslations('hero');
  const c = useTranslations('couple');

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center h-screen text-foreground relative overflow-hidden"
      style={{ 
        backgroundImage: 'url(/background.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f0f0f0'
      }}
    >
      {/* Decorative leaf in top left corner */}
      <div className="absolute -top-10 -left-4 z-10">
        <Image 
          src="/leaf_top.png" 
          alt="Decorative leaf" 
          width={400}
          height={400}
          className="w-48 h-48 md:w-60 md:h-60 lg:w-80 lg:h-80 opacity-80 -rotate-[40deg]"
        />
      </div>

      {/* Decorative leaf in bottom right corner */}
      <div className="absolute -bottom-10 -right-4 z-10">
        <Image 
          src="/leaf_bottom.png" 
          alt="Decorative leaf" 
          width={400}
          height={400}
          className="w-48 h-48 md:w-60 md:h-60 lg:w-80 lg:h-80 opacity-80 -rotate-[40deg]"
        />
      </div>

      {/* Names Section - Script font for elegance */}
      <h1 className="font-script font-normal text-5xl md:text-6xl lg:text-7xl mb-4 text-center leading-tight">
        {c('name1')} & {c('name2')}
      </h1>
      
      {/* Title */}
      <p className="font-heading text-lg md:text-xl tracking-[0.1em] text-muted-foreground mb-12">
        {t('title')}
      </p>

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
    </section>
  );
}