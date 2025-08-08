import {useTranslations} from 'next-intl';

export const Rsvp = () => {
  const t = useTranslations('rsvp');

  return (
    <section id="rsvp" className="py-20">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <form action={t('formspreeEndpoint')} method="POST" className="max-w-xl mx-auto mt-8">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">{t('nameLabel')}</label>
          <input type="text" id="name" name="name" required className="w-full p-2 border" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">{t('attendanceLabel')}</label>
          <input type="radio" id="yes" name="attendance" value="Yes" required />
          <label htmlFor="yes">{t('attendanceYes')}</label>
          <input type="radio" id="no" name="attendance" value="No" />
          <label htmlFor="no">{t('attendanceNo')}</label>
        </div>
        <div className="mb-4">
          <label htmlFor="plus-one" className="block mb-2">{t('plusOneLabel')}</label>
          <input type="text" id="plus-one" name="plus-one" className="w-full p-2 border" />
        </div>
        <button type="submit" className="w-full p-3 text-white bg-blue-600 rounded">{t('submitButton')}</button>
      </form>
    </section>
  );
}
