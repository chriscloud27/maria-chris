"use client"
import { Hero } from "@/components/Hero";
import { LocationExcursions } from "@/components/LocationExcursions";
import { Hotels } from "@/components/Hotels";
import { Destinations } from "@/components/Destinations";
import { Faq } from "@/components/Faq";
import { Nav } from "@/components/Nav";
// import { Details } from "@/components/Details";
import Attire from "@/components/Attire";
import { Schedule } from "@/components/Schedule";
import { Story } from "@/components/Story";
import { Footer } from "@/components/Footer";
import { MediaUpload } from "@/components/MediaUpload";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Index() {
  const t = useTranslations();
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);

  // enable smooth scrolling for anchor/hash link clicks
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev || "";
    };
  }, []);
  
  return (
    <>
      <Nav
        navItems={[
          { title: t('nav.story'), id: 'story' },
          { title: t('nav.schedule'), id: 'schedule' },
          { title: t('nav.attire'), id: 'attire' },
          { title: t('nav.location'), id: 'location' },
          { title: t('nav.hotels'), id: 'hotels' },
          { title: t('nav.media'), id: 'media' },
          { title: t('nav.destinations'), id: 'destinations' },
          { title: t('nav.faq'), id: 'faq' }
        ]}
        isCountdownFinished={isCountdownFinished}
      />
      <main>
        {/* After the countdown stopped:
            Hide: schedule, attire, locationexcursions, hotels, arrival, rsvp
            Show: confetti effect (done in Countdown.tsx)
        */}
        <section id="hero"><Hero onCountdownFinish={() => setIsCountdownFinished(true)} /></section> 
        <div className="container mx-auto px-4">
          <section id="media">
            <MediaUpload
              eventId="maria-chris"
              apiBaseUrl="/api/mediaupload"
              title={t('media.title')}
              description={t('media.description')}
            />
          </section>
        </div>
        <section id="story"><Story /></section>
        <section id="schedule"><Schedule /></section>
        {!isCountdownFinished && (
          <>
            {/* <section id="details"><Details /></section> */}
            <section id="attire"><Attire /></section>
          </>
        )}
        <div className="container mx-auto px-4">
          {!isCountdownFinished && <LocationExcursions />}
          {!isCountdownFinished && <section id="hotels"><Hotels /></section>}
          {isCountdownFinished && <section id="destinations"><Destinations /></section>}
          {/* {!isCountdownFinished && <section id="arrival"><Arrival /></section>} */}
          <section id="faq"><Faq /></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
