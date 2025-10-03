
import React from "react";
import { useTranslations } from "next-intl";

type ScheduleEvent = {
  time: string;
  title: string;
  description: string;
};

type ScheduleDay = {
  dateLabel: string;
  subtitle?: string;
  events: ScheduleEvent[];
};

export function Schedule() {
  const t = useTranslations("schedule");
  const days = t.raw("days") as ScheduleDay[];

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-semibold mb-2">{t("title")}</h2>
        <p className="text-lg text-gray-700">{t("subtitle")}</p>
      </div>
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 justify-center">
        {days.map((day, i) => (
          <div key={i} className={`flex-1 bg-white/80 rounded-2xl p-6 min-w-[260px] max-w-md mx-auto ${
            i === 1 ? 'shadow-2xl shadow-purple-500/50' : 'shadow'
          }`}>
              <div className="text-center mb-6">
                <h3 className="text-4xl font-script text-green-900">{day.dateLabel}</h3>
                {day.subtitle && (
                  <p className="text-sm text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: day.subtitle }}></p>
                )}
              </div>
            <ol className="relative border-l-2 border-[#7E4C9F] ml-4">
              {day.events.map((event, j) => (
                <li key={j} className="mb-6 ml-6 relative">
                  <span className="block text-sm text-gray-600 mb-1">{event.time}</span>
                  <span className="block font-bold text-lg mb-1">{event.title}</span>
                  <span className="block text-gray-700">{event.description}</span>
                  {j < day.events.length - 1 && <hr className="mt-6 border-gray-200" />}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
