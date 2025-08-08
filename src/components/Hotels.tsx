import {useTranslations} from 'next-intl';

export const Hotels = () => {
  const t = useTranslations('hotels');
  const hotelOptions = ['hotel1', 'hotel2', 'hotel3']; // Assuming 3 hotels based on previous structure

  return (
    <section id="hotels" className="py-20 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <div className="flex justify-around mt-8">
        {hotelOptions.map((hotelKey) => (
          <div key={t(`${hotelKey}.name`)}>
            <h3 className="text-xl font-semibold">{t(`${hotelKey}.name`)}</h3>
            <a href={t(`${hotelKey}.bookingLink`)} target="_blank" rel="noopener noreferrer">{t('bookingLinkText')}</a>
          </div>
        ))}
      </div>
    </section>
  );
}
