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
  // Start with null so server-render and initial client render match.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const t = useTranslations("countdown");

  useEffect(() => {
    // update immediately after mount, then every second
    const update = () => setTimeLeft(calculateTimeLeft(targetDate));
    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center font-script text-2xl md:text-3xl lg:text-4xl text-foreground -mt-6 mb-12">
        💍 {t('bigDay')} 🥂
      </div>
    );
  }

  return (
    <div className="text-center font-script text-2xl md:text-3xl lg:text-4xl text-foreground -mt-6 mb-12">
      💍 {timeLeft.days} {t('days')} : {timeLeft.hours.toString().padStart(2, '0')} {t('hrs')} : {timeLeft.minutes.toString().padStart(2, '0')} {t('min')} : {timeLeft.seconds.toString().padStart(2, '0')} {t('sec')} 🥂
    </div>
  );
};

export default Countdown;
