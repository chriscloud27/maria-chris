import React from 'react';
import { useTranslations } from 'next-intl';

interface Hotel {
  name: string;
  bookingLink?: string;
  location?: string;
  description: string;
  hint?: string;
  hintLink?: string;
  hintLinkText?: string;
}

interface HotelData {
  bookingLink?: string;
  location?: string;
  hintLink?: string;
}

export const Hotels = () => {
  const t = useTranslations('hotels');

  const hotels: Record<string, HotelData> = {
    AirBnb: {
      bookingLink: "https://www.airbnb.de/wishlists/invite/073a3280-7ab0-42f0-8f7a-719647dc0c1e?s=67&unique_share_id=76792540-b6b5-4741-ab72-b5c854c99fd9",
    },
    Booking: {
      bookingLink: "https://booking.com/mywishlist.html?wl=0d047fa6e3e74881afc5fe95210e08ce",
    },
    HotelBenger: {
      bookingLink: "https://www.hotel-benger.de/book-online/",
      location: "https://maps.app.goo.gl/wY8Zii2EMRH9PhmL9",
    },
  };

  const options = [
    {
      titleKey: 'option1Title',
      image: '/Monte-Gandolfo.png',
      places: ['AirBnb'],
    },
    {
      titleKey: 'option2Title',
      image: '/viajero.png',
      places: ['Booking'],
    },
    {
      titleKey: 'option3Title',
      image: '/hotel-benger.jpg',
      places: ['HotelBenger'],
    },
  ];

  return (
    <section id="hotels" className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-black">{t('title')}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="max-w-4xl mx-auto text-lg leading-relaxed">{t('subtitle')}</p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((opt) => {
          return (
            <div key={opt.titleKey} className="rounded-lg shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 overflow-hidden bg-white dark:bg-gray-800">
              <div className="relative h-40">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${opt.image}')` }}
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* centered title overlay (icon + title) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative text-white text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"></div>
                    <span className="text-center">{t(opt.titleKey)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {opt.places.map((placeKey) => {
                  const translated = t.raw(placeKey) as Omit<Hotel, 'bookingLink' | 'location' | 'hintLink'>;
                  const staticData = hotels[placeKey] || {};
                  const hotel = { ...translated, ...staticData } as Hotel;
                  
                  // Use promo text for AirBnb and Booking
                  const displayDescription = placeKey === 'AirBnb' ? t('airbnbPromo') : 
                                           placeKey === 'Booking' ? t('bookingPromo') : 
                                           hotel.description;
                  
                  return (
                    <div key={placeKey} className="mb-6 last:mb-0">
                      <h4 className="font-semibold text-lg mb-1 text-gray-800 dark:text-gray-200">{hotel.name}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">{displayDescription}</p>
                      {hotel.hint && placeKey !== 'AirBnb' && placeKey !== 'Booking' && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 italic">{hotel.hint}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {hotel.bookingLink && (
                          <a
                            href={hotel.bookingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            {t('bookingLinkText')}
                          </a>
                        )}
                        {hotel.location && (
                          <a
                            href={hotel.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            {t('locationText')}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};