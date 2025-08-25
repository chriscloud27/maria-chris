import React from 'react';
import { useTranslations } from 'next-intl';

export const Hotels = () => {
  const t = useTranslations('hotels');

  const safe = (key: string): string | null => {
    try {
  const v = t(key as string);
      return typeof v === 'string' ? v : String(v);
    } catch {
      return null;
    }
  };

  const hotelKeys = ['cristalinaCabana', 'hotel2', 'hotel3', 'guatapeViajero'];

  return (
    <section id="hotels" className="py-12">
      <h2 className="text-2xl font-bold text-center">{safe('title') ?? 'Hotels'}</h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotelKeys.map((key) => {
          const name = safe(`${key}.name`);
          const description = safe(`${key}.description`);
          const bookingLink = safe(`${key}.bookingLink`);
          const locationLink = safe(`${key}.location`);

          return (
            <div key={key} className="rounded-lg shadow overflow-hidden">
              <div className="bg-black text-white p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                  🛏️
                </div>
                <h3 className="text-xl font-semibold">{name ?? key}</h3>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6">
                {description && <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {bookingLink && (
                    <a
                      href={bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-600 hover:opacity-95 text-white py-3 px-4 rounded-full text-center"
                    >
                      {safe('bookingLinkText') ?? 'Book'}
                    </a>
                  )}

                  {locationLink && (
                    <a
                      href={locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-purple-600 hover:underline"
                    >
                      Map
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};