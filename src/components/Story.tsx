import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Story() {
  const t = useTranslations("story");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-stretch -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <div className="bg-white/80 p-8 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 h-full">
              <h2 className="text-4xl font-serif font-semibold mb-2">
                {t("title")}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-6"></div>
              <p className="text-gray-700 leading-relaxed mb-4">{t("subtitle")}</p>
              {/* <p className="text-gray-700 leading-relaxed mb-4">
                {t('paragraph1')}
                </p> */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("paragraph2")}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("paragraph3")}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("paragraph4")}
              </p>
              <p className="text-gray-700 leading-relaxed">{t("paragraph5")}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <Image
              src="/IMG_4697.jpg"
              alt="Our Story"
              width={600}
              height={400}
              priority
              className="rounded-2xl shadow-lg object-cover w-full h-80%"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
