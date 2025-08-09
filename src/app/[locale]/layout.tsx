
import { NextIntlClientProvider, useMessages } from 'next-intl';
import WhatsAppButton from "@/components/WhatsAppButton";

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      {children}
      <WhatsAppButton />
    </NextIntlClientProvider>
  );
}
