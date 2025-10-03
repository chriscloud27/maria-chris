import { FaPalette, FaChild } from "react-icons/fa";
import { PiDressLight } from "react-icons/pi";
import { useTranslations } from "next-intl";

export default function Attire() {
  const t = useTranslations("details");

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-semibold mb-2">{t("attireTitle")}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-700">{t("attireNote")}</p>
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 justify-center">
        {/* Colors Card (Box 1) */}
        <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 p-8 flex flex-col items-start min-w-[280px] max-w-sm mx-auto">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <FaPalette className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("attireOverview")}</h3>
          <p className="text-sm leading-relaxed space-y-1 mb-4">{t("attireColors")}</p>
          <div className="mt-auto">
            <a
              href="https://au.pinterest.com/pin/6685099441633578/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireExampleButton")}
            </a>
          </div>
        </div>

        {/* Cloths Card (Box 2) */}
        <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 p-8 flex flex-col items-start min-w-[280px] max-w-sm mx-auto">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <PiDressLight className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("attireExampleTitle")}</h3>
          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-2">{t("attireWomen")}</p>
            <p className="text-sm text-gray-600 mb-2">{t("attireMen")}</p>
            <p className="text-sm text-gray-600 mb-3">{t("attireKids")}</p>
          </div>
          <div className="mt-auto flex gap-2">
            <a
              href={t("attireButtonLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireWomenMenButton")}
            </a>
            <a
              href="https://pin.it/i/45Mdn5A2M/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireKidsButton")}
            </a>
          </div>
        </div>

        {/* White Boat Party Card (Box 3) */}
        <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 p-8 flex flex-col items-start min-w-[280px] max-w-sm mx-auto">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <FaChild className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("attireKidsTitle")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("attireBoatText")}</p>
          <div className="mt-auto">
            <a
              href={t("attireButtonLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireMoreDetailsButton")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
