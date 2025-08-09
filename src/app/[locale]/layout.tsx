import { ReactNode } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import WhatsAppButton from "@/components/WhatsAppButton";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <WhatsAppButton />
    </NextIntlClientProvider>
  );
}
