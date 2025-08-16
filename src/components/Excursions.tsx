import { useTranslations } from 'next-intl';
import {
  Star,
  Heart,
  MapPin,
  Gift,
  Sun,
  Phone,
  Mail,
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
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 text-purple-600">{icon}</div>
    <div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export const Excursions = () => {
  const t = useTranslations('excursions');

  const tips = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Best Time to Arrive',
      description:
        'Friday afternoon to enjoy the pre-wedding festivities and explore the colorful town',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Must-See',
      description:
        'Climb El Peñón rock (740 steps!) for breathtaking views of the reservoir',
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: 'Local Treats',
      description: 'Try arepas, empanadas, and fresh trout from the lake',
    },
    {
      icon: <Sun className="w-6 h-6" />,
      title: 'Weather',
      description:
        'June is perfect! 70-80°F, light jacket for evenings recommended',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Currency',
      description: 'Colombian Peso (COP). USD widely accepted in tourist areas',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Language',
      description: "Spanish (we'll have translators at the wedding!)",
    },
  ];

  return (
    <section id="excursions" className="py-20 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center mb-8">
          <Star className="w-8 h-8 text-yellow-500 mr-3" />
          <h2 className="text-3xl font-bold text-center">
            {t('title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {tips.map((tip, index) => (
            <TravelTip key={index} {...tip} />
          ))}
        </div>
      </div>
    </section>
  );
};

