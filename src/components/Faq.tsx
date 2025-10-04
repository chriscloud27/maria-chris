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
    setOpenStates((prev) => prev.map((v, i) => (i === index ? !v : v)));
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
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => toggleExpand(index)}
              >
                <h3 className="text-lg sm:text-xl">{item.question}</h3>
                <span
                  className={`ml-4 transform transition-transform duration-200 text-purple-600 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              <div
                id={id}
                className={`px-4 overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-96 py-4' : 'max-h-0'}`}
              >
                <div className="text-sm text-gray-700 leading-relaxed">
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