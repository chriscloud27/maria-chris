import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Hotels } from "@/components/Hotels";
import { Arrival } from "@/components/Arrival";
// import { PrePostEvents } from "@/components/PrePostEvents";
import { Rsvp } from "@/components/Rsvp";
import { Excursions } from "@/components/Excursions";
import { Faq } from "@/components/Faq";
import { Nav } from "@/components/Nav";
import { Details } from "@/components/Details";
import { Schedule } from "@/components/Schedule";
import { useTranslations } from "next-intl";

export default function Index() {
  const t = useTranslations();
  
  return (
    <>
      <Nav navItems={[
        { title: t('nav.details'), id: 'details' },
        { title: t('nav.schedule'), id: 'schedule' },
        { title: t('nav.location'), id: 'location' },
        { title: t('nav.hotels'), id: 'hotels' },
        { title: t('nav.arrival'), id: 'arrival' },
        { title: t('nav.rsvp'), id: 'rsvp' },
        { title: t('nav.excursions'), id: 'excursions' },
        { title: t('nav.faq'), id: 'faq' }
      ]} />
      <main>
        <Hero />
        <Details />
        <Schedule />
        <div className="container mx-auto px-4">
          <Location />
          <Hotels />
          <Arrival />
          <Rsvp />
          <Excursions />
          <Faq />
        </div>
      </main>
    </>
  );
}