"use client"
import { Destinations } from "@/components/Destinations";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function DestinationsPage() {
  const t = useTranslations();

  return (
    <>
      <Nav 
        navItems={[
          { title: t('nav.story'), id: 'story' },
          { title: t('nav.schedule'), id: 'schedule' },
          { title: t('nav.attire'), id: 'attire' },
          { title: t('nav.location'), id: 'location' },
          { title: t('nav.hotels'), id: 'hotels' },
          { title: t('nav.rsvp'), id: 'rsvp' },
          { title: t('nav.destinations'), id: 'destinations' },
          { title: t('nav.media'), id: 'media' },
          { title: t('nav.faq'), id: 'faq' }
        ]} 
        isCountdownFinished={true} // Always true for direct access
      />
      {/* Spacer div to prevent content from being hidden behind fixed header */}
      <div className="h-20"></div>
      <main>
        <section id="destinations"><Destinations /></section>
      </main>
      <Footer />
    </>
  );
}