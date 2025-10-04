"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const Faq = () => {
  const t = useTranslations('faq');

  // Prefer reading the `questions` array directly from translations when
  // available (clean and avoids probing many indices). If the translator
  // doesn't expose the array, fall back to the safe indexed loop.
  const faqData = (() => {
    // Attempt to read the entire questions array
    // `t('questions')` may return an object/array depending on i18n implementation.
    try {
  const raw = t('questions') as unknown;
      if (Array.isArray(raw)) {
        // Map array entries to the expected shape using runtime type checks
        return raw
          .map((entry) => {
            if (typeof entry === 'object' && entry !== null) {
              const e = entry as Record<string, unknown>;
              const question = typeof e.question === 'string' ? e.question : String(e.question ?? '');
              const answer = typeof e.answer === 'string' ? e.answer : String(e.answer ?? '');
              return { question, answer };
            }
            return { question: '', answer: '' };
          })
          .filter((it) => !!it.question);
      }
    } catch {
      // ignore and fall back
    }

    // Fallback: indexed probing (safe, small max to avoid infinite loops)
    const items: { question: string; answer: string }[] = [];
    const maxItems = 6;
    for (let i = 0; i < maxItems; i++) {
      const qKey = `questions.${i}.question`;
      const aKey = `questions.${i}.answer`;
      const question = t(qKey);
      const answer = t(aKey);

      if (!question || question === qKey) break;

      items.push({ question, answer });
    }

    return items;
  })();

  const [openStates, setOpenStates] = useState(() => faqData.map(() => false));

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