import {useTranslations} from 'next-intl';

export const Hotels = () => {
  const t = useTranslations('hotels');
  // Add Guatape Viajero as a new hotel
  const hotelOptions = ['cristalinaCabana', 'hotel2', 'hotel3', 'guatapeViajero', 'bookingGuatape', 'bookingAirbnb'];

  return (
    <section id="hotels" className="py-20 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>

      {/* grid: 1 col mobile, 2 cols sm, 3 cols lg — max three next to each other */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {hotelOptions.map((hotelKey) => {
          // Cristalina Cabana — show description and book button
          if (hotelKey === 'cristalinaCabana') {
            return (
              <div key="cristalinaCabana" className="rounded-lg shadow overflow-hidden">
                <div className="bg-black text-white p-6 flex items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">🏡</div>
                  <h3 className="text-xl font-semibold">{t('cristalinaCabana.name')}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <p className="mb-4 text-gray-600 dark:text-gray-300">{t('cristalinaCabana.description')}</p>
                  <a href={t('cristalinaCabana.bookingLink')} target="_blank" rel="noopener noreferrer" className="block mt-4 bg-purple-600 hover:opacity-95 text-white py-3 rounded-full text-center">
                    {t('bookingLinkText')}
                  </a>
                </div>
              </div>
            );
          }

          // Guatape Viajero — special card with voucher and external link
          if (hotelKey === 'guatapeViajero') {
            return (
              <div key="guatapeViajero" className="rounded-lg shadow overflow-hidden">
                <div className="bg-black text-white p-6 flex items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">🎒</div>
                  <h3 className="text-xl font-semibold">Guatape Viajero</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <p className="mb-3 text-gray-600 dark:text-gray-300">{t('guatapeViajero.description')}</p>
                  <span className="block mb-3 font-medium text-green-700 dark:text-green-400">{t('discountVoucher')} MACH2025</span>
                  <a href="https://www.viajerohostels.com/en/destinations-colombia/guatape/" target="_blank" rel="noopener noreferrer" className="block mt-4 bg-purple-600 hover:opacity-95 text-white py-3 rounded-full text-center">
                    Book here
                  </a>
                </div>
              </div>
            );
          }

          // Booking search card (Booking.com)
          if (hotelKey === 'bookingGuatape') {
            return (
              <div key="bookingGuatape" className="rounded-lg shadow overflow-hidden">
                <div className="bg-black text-white p-6 flex items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">🔎</div>
                  <h3 className="text-xl font-semibold">{t('searchOnBooking')}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <p className="mb-4 text-gray-600 dark:text-gray-300">{t('searchHotelOptionsCloseBy')}</p>
                  <a href="https://www.booking.com/searchresults.html?ss=Guatap%C3%A9%2C+Antioquia%2C+Colombia" target="_blank" rel="noopener noreferrer" className="block mt-4 bg-purple-600 hover:opacity-95 text-white py-3 rounded-full text-center">
                    {t('searchOnBooking')}
                  </a>
                </div>
              </div>
            );
          }

          // Airbnb search card
          if (hotelKey === 'bookingAirbnb') {
            return (
              <div key="bookingAirbnb" className="rounded-lg shadow overflow-hidden">
                <div className="bg-black text-white p-6 flex items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">🏠</div>
                  <h3 className="text-xl font-semibold">{t('searchOnAirbnb')}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <p className="mb-4 text-gray-600 dark:text-gray-300">{t('searchAirbnbOptionsCloseBy')}</p>
                  <a href="https://www.airbnb.com/s/Guatap%C3%A9--Antioquia--Colombia/homes" target="_blank" rel="noopener noreferrer" className="block mt-4 bg-purple-600 hover:opacity-95 text-white py-3 rounded-full text-center">
                    {t('searchOnAirbnb')}
                  </a>
                </div>
              </div>
            );
          }

          // Default: other hotels (hotel2, hotel3) — name + booking button
          return (
            <div key={hotelKey} className="rounded-lg shadow overflow-hidden">
              <div className="bg-black text-white p-6 flex items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">🛏️</div>
                <h3 className="text-xl font-semibold">{t(`${hotelKey}.name`)}</h3>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6">
                {/* show a description if available */}
                <p className="mb-4 text-gray-600 dark:text-gray-300">{t(`${hotelKey}.description`)}</p>
                <a href={t(`${hotelKey}.bookingLink`)} target="_blank" rel="noopener noreferrer" className="block mt-4 bg-purple-600 hover:opacity-95 text-white py-3 rounded-full text-center">
                  {t('bookingLinkText')}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
