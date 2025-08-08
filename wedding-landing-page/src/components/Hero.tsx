import {useTranslations} from 'next-intl';

export const Hero = () => {
  const t = useTranslations('hero');
  const c = useTranslations('couple');

  return (
    <section id="hero" className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="font-script text-7xl text-purple">{c('name1')} & {c('name2')}</h1>
      <p className="font-heading mt-4 text-4xl">{t('title')}</p>
      <p className="mt-2 text-xl">{t('subtitle')}</p>
    </section>
  );
}
