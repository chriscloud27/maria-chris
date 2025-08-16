
import Image from 'next/image';

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
  const arrivalData = {
    air: {
      imageSrc: '/arrival.jpeg',
      imageAlt: 'Plane flying over mountains',
      title: 'By Air',
      icon: <span className="text-xl font-bold text-purple-800">A</span>,
      content: [
        {
          title: 'International Flights',
          text: 'Fly to José María Córdova International Airport (MDE) in Medellín',
        },
        {
          title: 'Ground Transfer',
          text: "2-hour scenic drive to Guatapé (we'll arrange shuttles!)",
        },
        {
          title: 'Airlines',
          text: 'Avianca, LATAM, Copa Airlines, American Airlines',
        },
      ],
      buttonText: 'Find Flights',
      buttonLink: '#',
    },
    car: {
      imageSrc: '/location.jpeg',
      imageAlt: 'Winding road in Guatapé',
      title: 'By Car',
      icon: <span className="text-xl">🚗</span>,
      content: [
        {
          title: 'From Medellín',
          text: '2 hours via Autopista Medellín-Bogotá (beautiful mountain views!)',
        },
        {
          title: 'Car Rental',
          text: 'Available at MDE airport: Hertz, Avis, Budget, Localiza',
        },
        {
          title: 'Pro Tip',
          text: 'Stop in El Peñón village for empanadas and coffee!',
        },
      ],
      buttonText: 'Get Directions',
      buttonLink: '#',
    },
    transport: {
      imageSrc: '/excursion.jpeg',
      imageAlt: 'Colorful chiva bus in Colombia',
      title: 'Public Transport',
      icon: <span className="text-xl">🚌</span>,
      content: [
        {
          title: 'Metro + Bus',
          text: 'Take Metro to Norte terminal, then bus to Guatapé (3 hours total)',
        },
        {
          title: 'Direct Bus',
          text: 'Sotrasanvicente buses from Terminal del Norte every 30 mins',
        },
        {
          title: 'Adventure Option',
          text: 'Take a colorful "chiva" party bus for the full Colombian experience!',
        },
      ],
      buttonText: 'Bus Schedules',
      buttonLink: '#',
    },
  };

  return (
    <section id="arrival" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          How to Get Here
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
