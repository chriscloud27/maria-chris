import {useTranslations} from 'next-intl';

export const Faq = () => {
  const t = useTranslations('faq');

  return (
    <section id="faq" className="py-20">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{t('questions.0.question')}</h3>
          <p>{t('questions.0.answer')}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{t('questions.1.question')}</h3>
          <p>{t('questions.1.answer')}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{t('questions.2.question')}</h3>
          <p>{t('questions.2.answer')}</p>
        </div>
      </div>
    </section>
  );
}
