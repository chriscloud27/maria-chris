import type { Metadata } from "next";
import { Playfair_Display, Great_Vibes, Lato } from "next/font/google";
import "./globals.css";
import content from '@/content/wedding.json';

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

export const metadata: Metadata = {
  title: "Wedding Maria and Chris",
  description: content.hero.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${greatVibes.variable} ${lato.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
