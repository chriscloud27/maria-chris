import React from 'react';
import Image from 'next/image';

interface HeroShellProps {
  id?: string;
  children: React.ReactNode;
}

export const HeroShell = ({ id, children }: HeroShellProps) => {
  return (
    <section
      id={id}
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

      {children}
    </section>
  );
};
