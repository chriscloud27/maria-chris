"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import confetti from "canvas-confetti";

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

interface CountdownProps {
  targetDate: string;
  onCountdownFinish?: () => void;
}

const Countdown = ({ targetDate, onCountdownFinish }: CountdownProps) => {
  // Start with null so server-render and initial client render match.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const t = useTranslations("countdown");

  useEffect(() => {
    // update immediately after mount, then every second
    const update = () => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };
    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isInitialized]);

  useEffect(() => {
    // Trigger confetti ONLY when countdown reaches zero (not on initial load)
    if (isInitialized && !timeLeft && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      onCountdownFinish?.();
      
      // Fireworks effect
      const duration = 15 * 1000; // 15 seconds
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Fireworks from random positions
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [isInitialized, timeLeft, hasTriggeredConfetti, onCountdownFinish]);

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
