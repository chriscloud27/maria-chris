"use client"
import { Hero } from "@/components/Hero";
import { LocationExcursions } from "@/components/LocationExcursions";
import { Hotels } from "@/components/Hotels";
import { Destinations } from "@/components/Destinations";
import { Faq } from "@/components/Faq";
import { Nav } from "@/components/Nav";
import { Details } from "@/components/Details";
import Attire from "@/components/Attire";
import { Schedule } from "@/components/Schedule";
import { Story } from "@/components/Story";
import { Footer } from "@/components/Footer";
import { MediaUpload } from "@/components/MediaUpload";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// Import Rsvp component with SSR disabled to prevent hydration issues
const Rsvp = dynamic(() => import("@/components/Rsvp").then(mod => ({ default: mod.Rsvp })), {
  ssr: false,
  loading: () => (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 text-center">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
});

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
          { title: t('nav.rsvp'), id: 'rsvp' },
          { title: t('nav.destinations'), id: 'destinations' },
          { title: t('nav.media'), id: 'media' },
          { title: t('nav.faq'), id: 'faq' }
        ]} 
        isCountdownFinished={isCountdownFinished}
      />
      {/* Spacer div to prevent content from being hidden behind fixed header */}
      <div className="h-20"></div>
      <main>
        {/* After the countdown stopped: 
            Hide: schedule, attire, locationexcursions, hotels, arrival, rsvp
            Show: confetti effect (done in Countdown.tsx)
        */}
        <section id="hero"><Hero onCountdownFinish={() => setIsCountdownFinished(true)} /></section> 
        {!isCountdownFinished && (
          <>
            <div className="container mx-auto px-4">
              <section id="rsvp"><Rsvp /></section>
            </div>
            {/* <section id="details"><Details /></section> */}
            <section id="attire"><Attire /></section>
          </>
        )}
        <section id="story"><Story /></section>
        <section id="schedule"><Schedule /></section>
        <div className="container mx-auto px-4">
          {!isCountdownFinished && <LocationExcursions />}
          {!isCountdownFinished && <section id="hotels"><Hotels /></section>}
          {isCountdownFinished && <section id="destinations"><Destinations /></section>}
          {/* {!isCountdownFinished && <section id="arrival"><Arrival /></section>} */}
          {isCountdownFinished && (
            <section id="media">
              <MediaUpload 
                eventId="maria-chris" 
                apiBaseUrl="/api/mediaupload" 
                title={t('media.title')} 
                description={t('media.description')} 
              />
            </section>
          )}
          <section id="faq"><Faq /></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
