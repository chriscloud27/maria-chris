"use client"
import { MediaUpload } from "@/components/MediaUpload";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function JgaPage() {
  const t = useTranslations();

  return (
    <>
      <Nav 
        navItems={[
          { title: t('nav.story'), id: 'story' },
          { title: t('nav.details'), id: 'details' },
          { title: t('nav.media'), id: 'media' },
          { title: t('nav.faq'), id: 'faq' }
        ]} 
        isCountdownFinished={true}
      />
      {/* Spacer div to prevent content from being hidden behind fixed header */}
      <div className="h-20"></div>
      <main>
        <div className="container mx-auto px-4 py-20">
          <MediaUpload 
            eventId="maria-chris-jga" 
            apiBaseUrl="/api/jgaupload" 
            title={t('media.title')} 
            description={t('media.description')} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
