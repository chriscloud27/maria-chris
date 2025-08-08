'use client';

import { useTranslations } from 'next-intl';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export const Location = () => {
  const t = useTranslations('location');
  // Coordinates for "St. Margaretenkirche, München"
  const locationPosition = { lat: 48.1234, lng: 11.5678 }; 

  return (
    <section id="location" className="py-20">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className="flex flex-col items-center mt-8">
          <div className="w-full md:w-2/3 lg:w-1/2 px-4">
            <h3 className="text-xl font-semibold text-center">{t('main.name')}</h3>
            <p className="text-center">{t('main.address')}</p>
            <div style={{ height: '450px', width: '100%' }} className="mt-4 rounded-lg overflow-hidden shadow-lg">
              <Map defaultCenter={locationPosition} defaultZoom={15}>
                <Marker position={locationPosition} />
              </Map>
            </div>
          </div>
        </div>
      </APIProvider>
    </section>
  );
};
