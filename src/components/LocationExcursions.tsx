'use client';

import { useTranslations } from 'next-intl';
import {
  Heart,
  MapPin,
  Gift,
  Mail,
  Car,
} from 'lucide-react';

const TravelTip = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100">
    <div className="flex-shrink-0 text-green-600 bg-green-50 p-2 rounded-lg">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <div className="text-sm" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  </div>
);

export const LocationExcursions = () => {
  const tLocation = useTranslations('location');
  const tTips = useTranslations('travelTips');
  const tDetails = useTranslations('details');

  const tips = [
    {
      icon: <Heart className="w-5 h-5" />,
      title: tTips('bestTime.title'),
      description: tTips('bestTime.description'),
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: tTips('mustSee.title'),
      description: tTips('mustSee.description'),
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: tTips('localTreats.title'),
      description: tTips('localTreats.description'),
    },
    {
      icon: <Car className="w-5 h-5" />,
      title: tTips('parking.title'),
      description: `
        <p class="mb-2"><a href="${tDetails('parkingOption1Link')}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${tDetails('parkingOption1')}</a></p>
        <p class="mb-2"><a href="${tDetails('parkingOption2Link')}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${tDetails('parkingOption2')}</a></p>
        <p><a href="${tDetails('parkingOption3Link')}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${tDetails('parkingOption3')}</a></p>
      `,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: tTips('language.title'),
      description: tTips('language.description'),
    },
  ];

  return (
    <section id="location" className="py-20 relative">
      {/* Purple gradient background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-purple-100/20 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative">
        {/* Combined Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
              <h2 className="text-4xl font-bold text-black">
              {tLocation('title')} & {tLocation('tipsHeading')}
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
          <p className="max-w-4xl mx-auto text-lg leading-relaxed">
            {tLocation('intro')}
          </p>
        </div>

        {/* Creative Layout: Map and Tips Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Location Card with Map */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r ">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="text-xl font-bold">{tLocation('main.name')}</h3>
                  <p className="">{tLocation('main.address')}</p>
                </div>
              </div>
            </div>
            
            {/* Map Container */}
            <div className="relative">
              <div 
                style={{ height: '400px', width: '100%' }} 
                className="overflow-hidden"
              >
                <iframe
                  width="100%"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2506.5545824817164!2d6.633866428998448!3d51.33336804051034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8ba7166186679%3A0x8d629f090de22ad8!2sWinkmannshof%20by%20Qani!5e1!3m2!1sen!2sco!4v1773844942704!5m2!1sen!2sco"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Winkmannshof an der Burg"
                  className="hover:scale-105 transition-transform duration-500"
                ></iframe>
              </div>

              {/* Warning / accessibility note about the road */}
              <div className="p-4 bg-white/70 border-t border-purple-100 text-sm text-gray-700">
                <strong>{tLocation('roadWarningPrefix')}</strong> {tLocation('roadWarning')}
              </div>
              {/* Purple overlay border on hover */}
              <div className="absolute inset-0 border-4 border-transparent hover:border-purple-400/50 transition-colors duration-300 pointer-events-none rounded-b-2xl"></div>
            </div>
          </div>

          {/* Travel Tips Grid */}
          <div className="space-y-4">
            <div className="text-center mb-6">
              
            </div>
            
            <div className="grid gap-4" >
              {tips.map((tip, index) => (
                <TravelTip key={index} {...tip} />
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full blur-lg"></div>
      </div>
    </section>
  );
};