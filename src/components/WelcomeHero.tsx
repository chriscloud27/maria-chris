import React from 'react';
import { HeroShell } from './HeroShell';

export const WelcomeHero = () => {
  return (
    <HeroShell id="welcome">
      {/* Main welcome heading */}
      <h1 className="font-script font-normal text-5xl md:text-6xl lg:text-7xl mb-8 text-center leading-tight">
        Herzlich Willkommen
      </h1>

      {/* Bilingual subtitle */}
      <p className="font-heading text-lg md:text-xl tracking-[0.1em] text-muted-foreground mb-12 text-center">
        Bienvenidos!
      </p>

      {/* Intro text - bilingual */}
      <div className="text-center mb-12">
        <p className="font-heading text-base md:text-lg tracking-[0.15em] mb-2">
          Zur Hochzeit von
        </p>
        <p className="font-heading text-base md:text-lg tracking-[0.15em] text-muted-foreground">
          A la boda de
        </p>
      </div>

      {/* Couple names */}
      <h2 className="font-script font-normal text-5xl md:text-6xl lg:text-7xl mb-12 text-center leading-tight">
        Maria & Chris
      </h2>

      {/* Date Section */}
      <div className="text-center mb-12">
        <p className="font-heading text-xl md:text-2xl tracking-[0.3em] uppercase mb-4">August</p>
        <div className="border-t border-b border-foreground py-6 px-12 mb-4">
          <p className="font-script text-4xl md:text-5xl">8</p>
        </div>
        <p className="font-heading text-lg md:text-xl tracking-[0.2em]">2026</p>
      </div>

      {/* Location */}
      <div className="text-center max-w-md mb-8">
        <p className="font-heading text-base md:text-lg tracking-[0.15em] uppercase">
          Winkmannshof, Krefeld-Linn
        </p>
      </div>

      {/* Closing message - bilingual, script font, teal color */}
      <div className="text-center">
        <p className="font-script text-lg md:text-xl text-muted-foreground italic">
          Schön, dass ihr da seid
        </p>
        <p className="font-script text-lg md:text-xl text-muted-foreground italic">
          Es un placer tenerte aquí
        </p>
      </div>
    </HeroShell>
  );
};
