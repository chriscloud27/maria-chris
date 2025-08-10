
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { PiDressLight } from "react-icons/pi";
import { useTranslations } from "next-intl";

export function Details() {
  const t = useTranslations("details");
  return (
    <section className="py-16 bg-[url('/background-small.png')] bg-center bg-no-repeat bg-cover">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-semibold mb-2">{t("title")}</h2>
        <p className="text-lg text-gray-700">{t("subtitle")}</p>
      </div>
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 justify-center">
        {/* Date Card */}
        <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col items-start min-w-[280px] max-w-sm mx-auto">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <FaRegCalendarAlt className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("dateTitle")}</h3>
          <p className="mb-1">{t("dateMain")}</p>
          <p className="">{t("ceremonyTime")}</p>
        </div>
        {/* Venue Card */}
        <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col items-start min-w-[280px] max-w-sm mx-auto">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <GoLocation className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("venueTitle")}</h3>
          <p>{t("venueName")}<br />{t("venueAddress1")}<br />{t("venueAddress2")}</p>
          <a
            href={t("venueMapLink")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition"
          >
            {t("getDirections")}
          </a>
        </div>
        {/* Attire Card */}
        <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col items-start min-w-[280px] max-w-sm mx-auto">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <PiDressLight className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("attireTitle")}</h3>
          <p className="mb-1">{t("attireMain")}</p>
          <p>{t("attireNote")}</p>
        </div>
      </div>
    </section>
  );
}
