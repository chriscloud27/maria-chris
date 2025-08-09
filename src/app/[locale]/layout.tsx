import { Playfair_Display, Great_Vibes, Lato } from "next/font/google";
import {ReactNode} from 'react';
import {NextIntlClientProvider, useMessages} from 'next-intl';
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

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export default function LocaleLayout({children, params: {locale}}: Props) {
  // Providing all messages to the client
  // side is the easiest way to get started
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
