"use client"
import { Hero } from "@/components/Hero";
import { LocationExcursions } from "@/components/LocationExcursions";
import { Hotels } from "@/components/Hotels";
import { Arrival } from "@/components/Arrival";
// import { PrePostEvents } from "@/components/PrePostEvents";
import { Rsvp } from "@/components/Rsvp";
import { Faq } from "@/components/Faq";
import { Nav } from "@/components/Nav";
import { Details } from "@/components/Details";
import { Schedule } from "@/components/Schedule";
import { Story } from "@/components/Story";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

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
        <div className="container mx-auto px-4">
          <LocationExcursions />
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
