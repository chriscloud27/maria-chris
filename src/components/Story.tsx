import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function Story() {
  const t = useTranslations('story');

  return (
    <section className="py-20 bg-[url('/background-small.png')] bg-center bg-no-repeat bg-cover">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-stretch -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <div className="bg-white/80 p-8 rounded-2xl shadow-lg h-full">
              <h2 className="text-4xl font-serif font-semibold mb-2">{t('title')}</h2>
              <p className="text-lg text-gray-500 mb-6">{t('subtitle')}</p>
                {/* <p className="text-gray-700 leading-relaxed mb-4">
                {t('paragraph1')}
                </p> */}
                <p className="text-gray-700 leading-relaxed mb-4">
                {t('paragraph2')}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                {t('paragraph3')}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                {t('paragraph4')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                {t('paragraph5')}
                </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <Image 
              src="/IMG_0586.jpg" 
              alt="Our Story" 
              width={600} 
              height={400} 
              className="rounded-2xl shadow-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
