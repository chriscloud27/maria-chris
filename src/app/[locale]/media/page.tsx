"use client"
import { MediaUpload } from "@/components/MediaUpload";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function MediaPage() {
  const t = useTranslations();

  return (
    <>
      <Nav 
        navItems={[
          { title: t('nav.returnToWedding'), href: `/` },
          { title: t('nav.faq'), href: `/#faq` }
        ]} 
        isCountdownFinished={true}
      />
      {/* Spacer div to prevent content from being hidden behind fixed header */}
      <div className=""></div>
      <main>
        <div className="container mx-auto px-4 py-20">
          <MediaUpload 
            eventId="maria-chris" 
            apiBaseUrl="/api/mediaupload" 
            title={t('media.title')} 
            description={t('media.description')} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
