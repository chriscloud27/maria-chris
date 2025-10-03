"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const Faq = () => {
  const t = useTranslations('faq');

  const faqData = [
    {
      question: t('questions.0.question'),
      answer: t('questions.0.answer'),
    },
    {
      question: t('questions.1.question'),
      answer: t('questions.1.answer'),
    },
    {
      question: t('questions.2.question'),
      answer: t('questions.2.answer'),
    },
  ];

  const [openStates, setOpenStates] = useState(faqData.map(() => false));

  const toggleExpand = (index: number) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">{t('title')}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
      </div>
      <div className="space-y-4">
        {faqData.map((item, index) => {
          const id = `faq-${index}`;
          const isOpen = openStates[index];

          return (
            <div key={index} className="border-b border-gray-200">
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 text-left font-semibold"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => toggleExpand(index)}
              >
                <h3 className="text-xl">{item.question}</h3>
                <span className={`ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                  ▼
                </span>
              </button>
              <div
                id={id}
                className={`overflow-hidden transition-[height] duration-200 ease-in-out ${isOpen ? 'h-auto' : 'h-0'}`}
              >
                <div className="p-4">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export { Faq };