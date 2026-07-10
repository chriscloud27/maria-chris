"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PiDressLight } from "react-icons/pi";
import { useTranslations } from "next-intl";

function renderBoldLabel(s: string) {
  const str = String(s);
  if (/<\d+>/.test(str)) {
    const html = str
      .replace(/<(\d+)>(.*?)<\/\1>/g, "<strong>$2</strong>")
      .replace(/<(\d+)>(.*?)<\1>/g, "<strong>$2</strong>");
    return <p className="text-base text-gray-800 mb-1" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <p className="text-base text-gray-800 mb-1">{str}</p>;
}

export default function Attire() {
  const t = useTranslations("details");
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 p-8">
        {/* Icon */}
        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full border border-stone-300 bg-stone-50">
          <PiDressLight className="text-stone-600 text-3xl" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-serif font-bold mb-1 text-stone-900">{t("attireTitle")}</h2>
        <div className="w-20 h-0.5 bg-stone-300 mb-6" />

        {/* Women */}
        {renderBoldLabel(t("attireWomen"))}
        <p className="text-base text-gray-700 mb-4">{t("attireWomenClothes")}</p>

        {/* Men */}
        {renderBoldLabel(t("attireMen"))}
        <p className="text-base text-gray-700 mb-6">{t("attireMenClothes")}</p>

        {/* Zoom button */}
        <button
          onClick={() => setOpen(true)}
          className="mb-4 px-5 py-2 rounded border border-stone-400 text-stone-700 bg-white hover:bg-stone-50 font-medium transition text-base"
        >
          {t("attireZoomButton")}
        </button>

        {/* Thumbnail */}
        <div
          className="cursor-pointer w-44 rounded-xl overflow-hidden shadow border border-stone-200"
          onClick={() => setOpen(true)}
        >
          <Image
            src="/attire.jpg"
            alt="Attire guide"
            width={176}
            height={220}
            className="object-cover w-full h-full"
          />
        </div>
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={close}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-stone-300"
              aria-label="Close"
            >
              ✕
            </button>
            <Image
              src="/attire.jpg"
              alt="Attire guide"
              width={1200}
              height={900}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
