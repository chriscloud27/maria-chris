import React from 'react';
import { useTranslations } from 'next-intl';

export const Hotels = () => {
  const t = useTranslations?.('hotels');

  // Static hotel options as requested by the user
  const options = [
    {
      title: 'Option $',
      places: [
        { name: 'Monte Gondolfo', url: 'https://maps.app.goo.gl/4R2i92HRb2nYNgNZ8' },
        { name: 'y Viajero', url: 'https://maps.app.goo.gl/JorKrdR4DnhVNBKM7' },
      ],
    },
    {
      title: 'Option $$',
      places: [
        { name: 'Finca Hotel Mariangel', url: 'https://maps.app.goo.gl/ZS9GjGjpDTmswhjU8' },
        { name: 'Alto Luna Glamping', url: 'https://www.airbnb.com/rooms/1415467114306437650?guests=1&adults=1&s=67&unique_share_id=2e979ab5-cf80-4820-9357-60b1ab4252e7' },
      ],
    },
    {
      title: 'Option $$$',
      places: [
        { name: 'Atma Eco Villas', url: 'https://maps.app.goo.gl/E9gKBEWMmiCJCDrs9' },
        { name: 'Vivanti Resort', url: 'https://maps.app.goo.gl/1GhQbpWnnbCfV5eA9' },
      ],
    },
  ];

  return (
    <section id="hotels" className="py-12">
      <div className="text-center mb-10">
  <h2 className="text-4xl font-serif font-semibold mb-2">Hotel Options</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="max-w-4xl mx-auto text-lg leading-relaxed">
          {typeof t === 'function' ? t('subtitle') : 'Choose the option that fits your budget and preference — or select your own selection close to the venue that suits you best.'}
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((opt) => (
          <div key={opt.title} className="rounded-lg shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 overflow-hidden">
            <div className="bg-black text-white p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">🛏️</div>
              <h3 className="text-xl font-semibold">{opt.title}</h3>
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
                      see more
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};