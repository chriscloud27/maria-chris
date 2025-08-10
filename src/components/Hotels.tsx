import {useTranslations} from 'next-intl';

export const Hotels = () => {
  const t = useTranslations('hotels');
  // Add Guatape Viajero as a new hotel
  const hotelOptions = ['hotel1', 'hotel2', 'hotel3', 'guatapeViajero', 'bookingGuatape', 'bookingAirbnb'];

  return (
    <section id="hotels" className="py-20 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <div className="flex flex-wrap justify-around mt-8 gap-6">
        {hotelOptions.map((hotelKey) => {
          if (hotelKey === 'guatapeViajero') {
            return (
              <div key="guatapeViajero" className="max-w-xs p-4 bg-white dark:bg-gray-800 rounded shadow">
                <h3 className="text-xl font-semibold">Guatape Viajero</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-400">{t('guatapeViajero.description')}</p>
                <span className="block mb-1 font-medium text-green-700 dark:text-green-400">{t('discountVoucher')} MACH2025</span>
                <a href="https://www.viajerohostels.com/en/destinations-colombia/guatape/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Book here</a>
              </div>
            );
          } else if (hotelKey === 'bookingGuatape') {
            return (
              <div key="bookingGuatape" className="max-w-xs p-4 bg-white dark:bg-gray-800 rounded shadow">
                <h3 className="text-xl font-semibold">{t('searchOnBooking')}</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-400">{t('searchHotelOptionsCloseBy')}</p>
                <a href="https://www.booking.com/searchresults.html?label=gen173nr-10CAEoggI46AdIM1gEaDuIAQGYATO4AQfIAQzYAQPoAQH4AQGIAgGoAgG4Ap3y4cQGwAIB0gIkYjNiODZkMmQtYzZlMy00ODlkLTkwYTMtMDg1NTM1ZjZjYTA12AIB4AIB&aid=304142&ss=Guatap%C3%A9%2C+Antioquia%2C+Colombia&ssne=Antigua+Guatemala&ssne_untouched=Antigua+Guatemala&efdco=1&lang=en-us&src=index&dest_id=-585862&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=eeac4c0e2cd80dea&checkin=2025-12-18&checkout=2025-12-21&group_adults=2&no_rooms=1&group_children=0&nflt=oos%3D1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Search Booking.com</a>
              </div>
            );
          } else if (hotelKey === 'bookingAirbnb') {
            return (
              <div key="bookingAirbnb" className="max-w-xs p-4 bg-white dark:bg-gray-800 rounded shadow">
                <h3 className="text-xl font-semibold">{t('searchOnAirbnb')}</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-400">{t('searchAirbnbOptionsCloseBy')}</p>
                <a href="https://www.airbnb.com/s/Guatap%C3%A9--Antioquia--Colombia/homes?refinement_paths%5B%5D=%2Fhomes&place_id=ChIJu_HtcikdRI4R3HpvCZzE6cg&acp_id=69bee6d4-56a8-4141-8de9-8c4ae2de2cf8&date_picker_type=calendar&checkin=2025-12-18&checkout=2025-12-21&adults=2&source=structured_search_input_header&search_type=user_map_move&query=Guatap%C3%A9%2C%20Antioquia%2C%20Colombia&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2025-09-01&monthly_length=3&monthly_end_date=2025-12-01&search_mode=regular_search&price_filter_input_type=2&price_filter_num_nights=3&channel=EXPLORE&ne_lat=6.2526398950732185&ne_lng=-75.20193116350612&sw_lat=6.197336593147473&sw_lng=-75.24183552317072&zoom=14.06707973101568&zoom_level=14.06707973101568&search_by_map=true&min_bedrooms=1&selected_filter_order%5B%5D=min_bedrooms%3A1&update_selected_filters=false" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Search Airbnb</a>
              </div>
            );
          } else {
            return (
              <div key={t(`${hotelKey}.name`)} className="max-w-xs p-4 bg-white dark:bg-gray-800 rounded shadow">
                <h3 className="text-xl font-semibold">{t(`${hotelKey}.name`)}</h3>
                <a href={t(`${hotelKey}.bookingLink`)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t('bookingLinkText')}</a>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}
