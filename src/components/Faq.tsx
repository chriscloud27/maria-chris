"use client";
import React, { useState } from 'react';
import {useTranslations} from 'next-intl';

export const Faq = () => {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [0, 1, 2]; // ...existing code... (adjust indices or replace with dynamic source if you add more questions)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-20">
      <h2 className="text-3xl font-bold text-center">{t('title')}</h2>
      <div className="mt-8 space-y-4">
        {faqs.map((i) => (
          <div key={i} className="border rounded-md overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50"
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-${i}`}
            >
              <h3 className="text-left text-xl font-semibold">{t(`questions.${i}.question`)}</h3>
              <span
                className={`ml-4 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>

            <div
              id={`faq-${i}`}
              className={`px-4 pt-0 pb-4 text-gray-700 transition-[max-height] duration-300 overflow-hidden ${openIndex === i ? 'max-h-40' : 'max-h-0'}`}
            >
              <p>{t(`questions.${i}.answer`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
