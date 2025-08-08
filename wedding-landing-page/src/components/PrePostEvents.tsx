import {useTranslations} from 'next-intl';

export const PrePostEvents = () => {
  const t = useTranslations('prePostEvents');

  return (
    <section id="pre-post-events" className="py-20 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <div className="flex justify-around mt-8">
        <div>
          <h3 className="text-xl font-semibold">{t('events.0.name')}</h3>
          <p>{t('events.0.description')}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{t('events.1.name')}</h3>
          <p>{t('events.1.description')}</p>
        </div>
      </div>
    </section>
  );
}
