import {useTranslations} from 'next-intl';

export const Arrival = () => {
  const t = useTranslations('arrival');

  return (
    <section id="arrival" className="py-20">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <div className="mt-8 space-y-4">
        <p><strong>Train:</strong> {t('train')}</p>
        <p><strong>Taxi:</strong> {t('taxi')}</p>
        <p><strong>Car:</strong> {t('car')}</p>
        <p><strong>Airport:</strong> {t('airport')}</p>
      </div>
    </section>
  );
}
