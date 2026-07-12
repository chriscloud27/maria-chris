'use client';

import WhatsAppIcon from './icons/WhatsAppIcon';

const WhatsAppButton = () => {
  const whatsappLink = "https://chat.whatsapp.com/IUsLSxoLMyMBfavdScI9vG?mode=gi_t";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-[60] transition-transform transform hover:scale-110 border-2 border-white"
      aria-label="Open WhatsApp Group"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
};

export default WhatsAppButton;
