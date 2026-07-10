import type { Metadata } from "next";
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/nunito';
import '@fontsource/great-vibes/400.css';
import '@fontsource-variable/dancing-script';
import '@fontsource-variable/jetbrains-mono';
import "./globals.css";
import content from '@/content/wedding.json';

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
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
