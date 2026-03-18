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
  <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 py-8 flex flex-col items-start w-full max-w-sm mx-auto px-4 sm:px-8">
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
  <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 py-8 flex flex-col items-start w-full max-w-sm mx-auto px-4 sm:px-8">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <PiDressLight className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("attireExampleTitle")}</h3>
          <div className="mb-2">
            {/*
              Support two patterns in translations:
              1) Numeric element markers like <0>text</0> or (sometimes) <0>text<0>
                 - Treat the enclosed text as bold. These are often emitted by
                   translation tooling that represents elements as numeric tags.
              2) Legacy colon-based label formatting: "Label: rest"
                 - Keep existing behavior where the portion before the first ':'
                   is rendered bold.
            */}
            {(() => {
              const renderWithMarkersOrColon = (s: string | undefined, extraClass = "mb-2") => {
                if (!s || s.trim().length === 0) return null;
                const str = String(s);

                // If the translation contains numeric markers like <0>, convert them
                // to <strong> so we can render the HTML. Support either closing
                // form </0> or the uncommon shorthand <0>...<0>.
                if (/<\d+>/.test(str)) {
                  const html = str
                    .replace(/<(\d+)>(.*?)<\/\1>/g, '<strong>$2</strong>')
                    .replace(/<(\d+)>(.*?)<\1>/g, '<strong>$2</strong>');
                  return (
                    <p
                      className={`text-sm text-gray-600 ${extraClass}`}
                      // translations are local/trusted; render the small HTML snippet
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }

                // Fallback: keep previous colon-based bold label behavior
                const parts = str.split(":");
                if (parts.length > 1) {
                  const label = parts.shift();
                  const rest = parts.join(":");
                  return (
                    <p className={`text-sm text-gray-600 ${extraClass}`}>
                      <strong>{label}:</strong>
                      {rest}
                    </p>
                  );
                }

                return <p className={`text-sm text-gray-600 ${extraClass}`}>{str}</p>;
              };

              return (
                <>
                  {renderWithMarkersOrColon(t("attireWomen"))}
                  {renderWithMarkersOrColon(t("attireMen"))}
                  {renderWithMarkersOrColon(t("attireKids"), "mb-3")}
                </>
              );
            })()}
          </div>
          <div className="mt-auto flex gap-2">
            <a
              href="https://au.pinterest.com/pin/4151824652621908/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireWomenMenButton")}
            </a>
            <a
              href="https://www.pinterest.com/pin/138907969754227796"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireKidsButton")}
            </a>
            <a
              href="https://www.pinterest.com/pin/291185932180375333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireWomenShoesButton")}
            </a>
            
          </div>
        </div>

        {/* White Boat Party Card (Box 3) - Commented out as there's no white boat party */}
        {/*
  <div className="flex-1 bg-white rounded-2xl shadow shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 py-8 flex flex-col items-start w-full max-w-sm mx-auto px-4 sm:px-8">
          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full border border-green-900/30">
            <FaChild className="text-green-900 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("attireKidsTitle")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("attireBoatText")}</p>
          <div className="mt-auto">
            <a
              href="https://au.pinterest.com/pin/107804985306291399"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded border border-green-900/30 text-green-900 bg-green-50 hover:bg-green-100 font-medium transition text-sm"
            >
              {t("attireMoreDetailsButton")}
            </a>
            
          </div>
        </div>
        */}
      </div>
    </section>
  );
}
