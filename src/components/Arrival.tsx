import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Card = ({
  imageSrc,
  imageAlt,
  title,
  icon,
  content,
  buttonText,
  buttonLink,
}: {
  imageSrc: string;
  imageAlt: string;
  title: string;
  icon: React.ReactNode;
  content: { title: string; text: string }[];
  buttonText: string;
  buttonLink: string;
}) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
    <div className="relative h-48">
      <Image
        src={imageSrc}
        alt={imageAlt}
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-white text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 bg-opacity-50 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <span>{title}</span>
        </div>
      </div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <ul className="space-y-4 flex-grow">
        {content.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-purple-500 text-xl mr-3 mt-1">•</span>
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-gray-600">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <a
        href={buttonLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block w-full text-center py-3 rounded-lg font-semibold transition-colors duration-300 bg-purple-600 text-white hover:bg-purple-700"
      >
        {buttonText}
      </a>
    </div>
  </div>
);

export const Arrival = () => {
  const t = useTranslations('arrival');

  const arrivalData = {
    air: {
      imageSrc: '/arrival.jpeg',
      imageAlt: t('cards.air.imageAlt'),
      title: t('cards.air.title'),
      icon: <span className="text-xl font-bold text-purple-800">A</span>,
      content: [
        {
          title: t('cards.air.content.item1.title'),
          text: t('cards.air.content.item1.text'),
        },
        {
          title: t('cards.air.content.item2.title'),
          text: t('cards.air.content.item2.text'),
        },
        {
          title: t('cards.air.content.item3.title'),
          text: t('cards.air.content.item3.text'),
        },
      ],
      buttonText: t('cards.air.buttonText'),
      buttonLink: t('cards.air.buttonLink'),
    },
    car: {
      imageSrc: '/location.jpeg',
      imageAlt: t('cards.car.imageAlt'),
      title: t('cards.car.title'),
      icon: <span className="text-xl">🚗</span>,
      content: [
        {
          title: t('cards.car.content.item1.title'),
          text: t('cards.car.content.item1.text'),
        },
        {
          title: t('cards.car.content.item2.title'),
          text: t('cards.car.content.item2.text'),
        },
        {
          title: t('cards.car.content.item3.title'),
          text: t('cards.car.content.item3.text'),
        },
      ],
      buttonText: t('cards.car.buttonText'),
      buttonLink: t('cards.car.buttonLink'),
    },
    transport: {
      imageSrc: '/excursion.jpeg',
      imageAlt: t('cards.transport.imageAlt'),
      title: t('cards.transport.title'),
      icon: <span className="text-xl">🚌</span>,
      content: [
        {
          title: t('cards.transport.content.item1.title'),
          text: t('cards.transport.content.item1.text'),
        },
        {
          title: t('cards.transport.content.item2.title'),
          text: t('cards.transport.content.item2.text'),
        },
        {
          title: t('cards.transport.content.item3.title'),
          text: t('cards.transport.content.item3.text'),
        },
      ],
      buttonText: t('cards.transport.buttonText'),
      buttonLink: t('cards.transport.buttonLink'),
    },
  };

  return (
    <section id="arrival" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('headerTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card {...arrivalData.air} />
          <Card {...arrivalData.car} />
          <Card {...arrivalData.transport} />
        </div>
      </div>
    </section>
  );
};
