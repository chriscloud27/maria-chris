import { Playfair_Display, Great_Vibes, Lato } from "next/font/google";
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import WhatsAppButton from "@/components/WhatsAppButton";

import "@fontsource/playfair-display";
import "@fontsource/great-vibes";
import "@fontsource/lato";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'de'}, {locale: 'es'}];
}

export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  setRequestLocale(locale);
  const messages = useMessages();
 
  return (
    <html lang={locale}>
      <body className={`${playfairDisplay.variable} ${greatVibes.variable} ${lato.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
