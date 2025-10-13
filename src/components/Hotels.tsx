import React from 'react';
import { useTranslations } from 'next-intl';

export const Hotels = () => {
  const t = useTranslations('hotels');

  // Static hotel options (names/urls kept static but titles/labels localized)
  const options = [
    {
      titleKey: 'option1Title',
      image: '/Monte-Gandolfo.png',
      places: [
        { name: 'Monte Gondolfo', url: 'https://maps.app.goo.gl/4R2i92HRb2nYNgNZ8' },
        { name: 'Hotel Nova', url: 'https://maps.app.goo.gl/dVeoa2GSJtkXLMjt8?g_st=ipc' },
      ],
    },
    {
      titleKey: 'option2Title',
      image: '/viajero.png',
      places: [
        { name: 'Viajero', url: 'https://maps.app.goo.gl/JorKrdR4DnhVNBKM7' },
        { name: 'Alto Luna Glamping', url: 'https://www.airbnb.com/rooms/1415467114306437650?guests=1&adults=1&s=67&unique_share_id=2e979ab5-cf80-4820-9357-60b1ab4252e7' },
      ],
    },
    {
      titleKey: 'option3Title',
      image: '/vivanti.png',
      places: [
        { name: 'Atma Eco Villas', url: 'https://maps.app.goo.gl/E9gKBEWMmiCJCDrs9' },
        { name: 'Vivanti Resort', url: 'https://maps.app.goo.gl/1GhQbpWnnbCfV5eA9' },
      ],
    },
  ];

  return (
    <section id="hotels" className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-semibold mb-2">{t('title')}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="max-w-4xl mx-auto text-lg leading-relaxed">{t('subtitle')}</p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((opt, idx) => {
          const dollarPrefix = '$'.repeat(idx + 1);
          return (
            <div key={opt.titleKey} className="rounded-lg shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 overflow-hidden">
              <div className="relative h-40">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${opt.image}')` }}
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* centered title overlay (icon + title) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative text-white text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">{dollarPrefix}</div>
                    <span className="text-center">{dollarPrefix} {t(opt.titleKey)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6">
                <ul className="mb-4 text-gray-600 dark:text-gray-300 space-y-2">
                  {opt.places.map((p) => (
                    <li key={p.url} className="flex items-center justify-between">
                      <span>{p.name}</span>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline ml-3"
                      >
                        {t('seeMore')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};