import {useTranslations} from 'next-intl';
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Hotels } from "@/components/Hotels";
import { Arrival } from "@/components/Arrival";
import { PrePostEvents } from "@/components/PrePostEvents";
import { Rsvp } from "@/components/Rsvp";
import { Excursions } from "@/components/Excursions";
import { Faq } from "@/components/Faq";
import { Nav } from "@/components/Nav";
 
export default function Index() {
  const t = useTranslations('Index');
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="container mx-auto px-4">
          <Location />
          <Hotels />
          <Arrival />
          <PrePostEvents />
          <Rsvp />
          <Excursions />
          <Faq />
        </div>
      </main>
    </>
  );
}
