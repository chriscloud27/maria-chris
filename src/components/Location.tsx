'use client';

import { useTranslations } from 'next-intl';

export const Location = () => {
  const t = useTranslations('location');
  // Coordinates for "St. Margaretenkirche, München"
  // const locationPosition = { lat: 48.1234, lng: 11.5678 }; 

  return (
    <section id="location" className="py-20">
  <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
  <p className="max-w-2xl mx-auto mt-4 text-center text-lg text-gray-700 dark:text-gray-300">{t('intro')}</p>
      <div className="flex flex-col items-center mt-8">
        <div className="w-full md:w-2/3 lg:w-1/2 px-4">
          <h3 className="text-xl font-semibold text-center">{t('main.name')}</h3>
          <p className="text-center">{t('main.address')}</p>
          {/* Embedded Google Map for Parque Lleras, Medellín */}
          <div style={{ height: '450px', width: '100%' }} className="mt-4 rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5391.741581316906!2d-75.22461681295016!3d6.218998077702833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e441dbe3a08b0a7%3A0x90e6142371913e61!2sCasa%20Loma%20%2C%20Hotel%20Boutique!5e1!3m2!1sde!2sde!4v1759519351644!5m2!1sde!2sde"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map of Parque Lleras, Medellín"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
