import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Guest {
  Name: string;
  Table_nr: string;
}

// Mapping of table numbers to destinations
const tableDestinationMapping: Record<number, string> = {
  1: 'bulgaria',
  2: 'australia',
  3: 'india',
  4: 'alamia',
  5: 'espania',
  6: 'japon',
  7: 'colombia'
};

export const Destinations = () => {
  const t = useTranslations('destinations');
  const [tables, setTables] = useState<Array<{
    nameKey: string;
    number: number;
    destinations: string[];
  }>>([]);

  const colorClasses = [
    'bg-red-500 text-white',    // 1
    'bg-yellow-500 text-black', // 2
    'bg-green-500 text-white',  // 3
    'bg-blue-500 text-white',   // 4
    'bg-purple-500 text-white', // 5
    'bg-pink-500 text-white',   // 6
    'bg-indigo-500 text-white', // 7
    'bg-teal-500 text-white'    // 8
  ];

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch('/api/guests');
        const guests: Guest[] = await response.json();

        // Group guests by table number, filtering out empty table numbers
        const groupedGuests = guests.reduce((acc, guest) => {
          const tableNr = guest.Table_nr?.trim();
          const name = guest.Name?.trim();

          if (tableNr && name && tableNr !== '') {
            const tableNum = parseInt(tableNr);
            if (!acc[tableNum]) {
              acc[tableNum] = [];
            }
            // Truncate names to maximum 18 characters
            acc[tableNum].push(name.length > 18 ? name.substring(0, 18) : name);
          }
          return acc;
        }, {} as Record<number, string[]>);

        // Convert to the format expected by the component using the mapping
        const tablesData = Object.keys(tableDestinationMapping).map(tableNumStr => {
          const tableNum = parseInt(tableNumStr);
          return {
            nameKey: `table${tableNum}`,
            number: tableNum,
            destinations: groupedGuests[tableNum] || []
          };
        });

        setTables(tablesData);
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };

    fetchGuests();
  }, []);

  const maxLength = 18;

  return (
    <section id="destinations" className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold font-mono bg-gray-800 text-yellow-400 px-4 py-2 rounded-lg inline-block">{t('title')}</h2>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {tables.map((table) => (
          <div key={table.number} className="rounded-lg shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 overflow-hidden bg-gray-800 text-yellow-400 font-mono p-6">
            <div className="flex flex-col items-start space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${colorClasses[table.number - 1]} flex items-center justify-center text-sm font-bold rounded`}>
                  {table.number}
                </div>
                <span className="text-white font-mono">{t('mesaLabel')}</span>
              </div>
              <h3 className="text-xl font-bold uppercase font-mono">{t(tableDestinationMapping[table.number])}</h3>
            </div>
            <div className="space-y-4">
              {table.destinations.map((dest, index) => {
                const padded = dest + ' '.repeat(maxLength - dest.length);
                return (
                  <div key={index} className="text-sm font-bold uppercase font-mono flex flex-wrap gap-1">
                    {padded.split('').map((letter, i) => (
                      <span key={i} className="bg-gray-700 text-yellow-400 px-1 py-0.5 rounded text-xs w-5 h-6 flex items-center justify-center font-mono font-black">
                        {letter}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};