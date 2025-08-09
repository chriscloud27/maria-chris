'use client';

import { useTranslations } from 'next-intl';

export const Location = () => {
  const t = useTranslations('location');
  // Coordinates for "St. Margaretenkirche, München"
  const locationPosition = { lat: 48.1234, lng: 11.5678 }; 

  return (
    <section id="location" className="py-20">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <div className="flex flex-col items-center mt-8">
        <div className="w-full md:w-2/3 lg:w-1/2 px-4">
          <h3 className="text-xl font-semibold text-center">{t('main.name')}</h3>
          <p className="text-center">{t('main.address')}</p>
          {/* Embedded Google Map for Parque Lleras, Medellín */}
          <div style={{ height: '450px', width: '100%' }} className="mt-4 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.726964073624!2d-75.5707268241556!3d6.209517993782998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e46827e7e2e2e2d%3A0x7e2e2e2e2e2e2e2e!2sParque%20Lleras!5e0!3m2!1sen!2sco!4v1691600000000!5m2!1sen!2sco"
              width="100%"
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
