import { GoLocation } from "react-icons/go";
import { PiDressLight } from "react-icons/pi";
import { useTranslations, useLocale } from "next-intl";

export function Details() {
  const t = useTranslations("details");
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-semibold mb-2">{t("title")}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
        {/* <p className="text-lg text-gray-700">{t("subtitle")}</p> */}
      </div>
  <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {/* Venue Card */}
  <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 py-8 flex flex-col justify-between items-start w-full max-w-sm mx-auto px-4 sm:px-8">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <GoLocation className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("venueTitle")}</h3>
          <p>{t("venueName")}<br />{t("venueAddress1")}<br />{t("venueAddress2")}</p>
          <div className="mt-4">
            <a
              href="#location"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("getDirections")}
            </a>
          </div>
        </div>
        {/* Attire Card */}
  <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 py-8 flex flex-col justify-between items-start w-full max-w-sm mx-auto px-4 sm:px-8">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <PiDressLight className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("attireTitle")}</h3>
          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-2">{t("attireSummary")}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-start mt-4">
            <a
              href="#attire"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("showDetailsButton")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
