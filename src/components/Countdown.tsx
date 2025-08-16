"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: string): TimeLeft | null => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft: TimeLeft | null = null;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(targetDate)
  );
  const t = useTranslations("Countdown");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="text-center">
      <div className="text-4xl md:text-6xl font-bold text-white">
        <span>{timeLeft.days}</span>
        <span className="text-xl md:text-2xl">{t("days")}</span>{" "}
        <span>{timeLeft.hours}</span>
        <span className="text-xl md:text-2xl">{t("hours")}</span>{" "}
        <span>{timeLeft.minutes}</span>
        <span className="text-xl md:text-2xl">{t("minutes")}</span>
      </div>
    </div>
  );
};

export default Countdown;
