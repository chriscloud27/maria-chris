
import LocaleLayoutInner from './LocaleLayoutInner';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Load messages server-side
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const timeZone = 'America/Bogota';
  return (
    <LocaleLayoutInner locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </LocaleLayoutInner>
  );
}
