import { Playfair_Display, Great_Vibes, Lato } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { locales } from "@/navigation";

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
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`
        ${playfairDisplay.variable}
        ${greatVibes.variable}
        ${lato.variable}
        antialiased
      `
          .replace(/\s+/g, " ")
          .trim()}
      >
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="America/Bogota"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
