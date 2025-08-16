import type { Metadata } from "next";
import { 
  Playfair_Display, 
  Cormorant_Garamond, 
  Great_Vibes, 
  Dancing_Script,
  Inter,
  Nunito 
} from "next/font/google";
import "./globals.css";
import content from '@/content/wedding.json';

// Heading Fonts (Serif, elegant, festlich)
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: 'swap',
});

// Body Fonts (Sans-Serif, modern, klar)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
  display: 'swap',
});

// Accent Fonts (Script/Handwritten)
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Maria and Chris",
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
        className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${inter.variable} ${nunito.variable} ${greatVibes.variable} ${dancingScript.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
