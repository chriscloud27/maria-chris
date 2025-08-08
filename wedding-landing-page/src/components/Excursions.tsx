import {useTranslations} from 'next-intl';

export const Excursions = () => {
  const t = useTranslations('excursions');

  return (
    <section id="excursions" className="py-20 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <ul className="mt-8 space-y-2 list-disc list-inside">
        <li>{t('tips.0')}</li>
        <li>{t('tips.1')}</li>
        <li>{t('tips.2')}</li>
      </ul>
    </section>
  );
}
