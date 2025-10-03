"use client"
import { Hero } from "@/components/Hero";
import { LocationExcursions } from "@/components/LocationExcursions";
import { Hotels } from "@/components/Hotels";
import { Arrival } from "@/components/Arrival";
// import { PrePostEvents } from "@/components/PrePostEvents";
import { Faq } from "@/components/Faq";
import { Nav } from "@/components/Nav";
import { Details } from "@/components/Details";
import Attire from "@/components/Attire";
import { Schedule } from "@/components/Schedule";
import { Story } from "@/components/Story";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
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
      <Nav navItems={[
        { title: t('nav.story'), id: 'story' },
        { title: t('nav.details'), id: 'details' },
        { title: t('nav.schedule'), id: 'schedule' },
        { title: t('nav.location'), id: 'location' },
        { title: t('nav.hotels'), id: 'hotels' },
        { title: t('nav.arrival'), id: 'arrival' },
        { title: t('nav.rsvp'), id: 'rsvp' },
        { title: t('nav.faq'), id: 'faq' }
      ]} />
      {/* Spacer div to prevent content from being hidden behind fixed header */}
      <div className="h-20"></div>
      <main>
        <section id="hero"><Hero /></section>
        <section id="story"><Story /></section>
        <section id="details"><Details /></section>
        <section id="schedule"><Schedule /></section>
        <div className="container mx-auto px-4"><LocationExcursions />
        <section id="attire"><Attire /></section>
          <section id="hotels"><Hotels /></section>
          <section id="arrival"><Arrival /></section>
          <section id="rsvp"><Rsvp /></section>
          <section id="faq"><Faq /></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
