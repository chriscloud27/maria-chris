"use client";
import { NextIntlClientProvider } from 'next-intl';
import Chatbot from '@/components/Chatbot';


interface LocaleLayoutInnerProps {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
  timeZone: string;
}

export default function LocaleLayoutInner({ children, locale, messages, timeZone }: LocaleLayoutInnerProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
  {children}
  <Chatbot />
    </NextIntlClientProvider>
  );
}
