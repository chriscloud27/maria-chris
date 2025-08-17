'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema, RsvpData } from '@/lib/schema';
import { useState } from 'react';
import { CutleryIcon } from './icons/CutleryIcon';
import { MusicIcon } from './icons/MusicIcon';
import { StarIcon } from './icons/StarIcon';

type FormInputs = RsvpData & {
  honeypot?: string;
};

export const Rsvp = () => {
  const t = useTranslations('rsvp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(rsvpSchema),
  });

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Honeypot check
    if (data.honeypot) {
        console.log("Bot submission detected");
        // Silently fail
        setSubmitStatus({ success: true, message: t('successMessage') });
        return;
    }
    
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (response.ok) {
      setSubmitStatus({ success: true, message: t('successMessage') });
      reset();
    } else {
      setSubmitStatus({ success: false, message: result.error || t('errorMessage') });
    }
  };

  return (
    <section id="rsvp" className="py-20 bg-stone-50" style={{backgroundImage: "url('/background-small.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-start">
        
        <div className="text-gray-700">
            <h2 className="text-4xl font-serif text-gray-800 mb-4">{t('title')}</h2>
            <p className="mb-8">{t('invitation')}</p>
            
            <ul className="space-y-4">
                <li className="flex items-start">
                    <CutleryIcon className="w-6 h-6 mr-3 mt-1 text-gray-600" />
                    <span>{t('dinnerInfo')}</span>
                </li>
                <li className="flex items-start">
                    <MusicIcon className="w-6 h-6 mr-3 mt-1 text-gray-600" />
                    <span>{t('songInfo')}</span>
                </li>
                <li className="flex items-start">
                    <StarIcon className="w-6 h-6 mr-3 mt-1 text-gray-600" />
                    <span>{t('kidsInfo')}</span>
                </li>
            </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-2">{t('formTitle')}</h3>
          <p className="text-gray-600 mb-6">{t('formSubtitle')}</p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`w-full p-3 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Attendance */}
            <div className="mb-4">
              <label htmlFor="attendance" className="block text-gray-700 text-sm font-bold mb-2">
                {t('attendanceLabel')}
              </label>
              <select
                id="attendance"
                {...register('attendance')}
                className={`w-full p-3 border rounded-md bg-white ${errors.attendance ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="accepted">{t('attendanceYes')}</option>
                <option value="declined">{t('attendanceNo')}</option>
              </select>
              {errors.attendance && <p className="text-red-500 text-xs mt-1">{errors.attendance.message}</p>}
            </div>

            {/* Song Request */}
            <div className="mb-4">
              <label htmlFor="song" className="block text-gray-700 text-sm font-bold mb-2">
                {t('songRequestLabel')}
              </label>
              <input
                type="text"
                id="song"
                {...register('song')}
                placeholder={t('songRequestPlaceholder')}
                className="w-full p-3 border border-gray-200 rounded-md"
              />
               {errors.song && <p className="text-red-500 text-xs mt-1">{errors.song.message}</p>}
            </div>

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                {t('messageLabel')}
              </label>
              <textarea
                id="message"
                {...register('message')}
                rows={3}
                placeholder={t('messagePlaceholder')}
                className="w-full p-3 border border-gray-200 rounded-md"
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>
            
            {/* Honeypot field for spam protection */}
            <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot"></label>
                <input type="text" id="honeypot" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-3 bg-purple-700 text-white font-bold rounded-md hover:bg-purple-800 disabled:bg-gray-400 transition-colors duration-300"
              >
                {isSubmitting ? t('submittingButton') : t('submitButton')}
              </button>
            </div>
          </form>

          {submitStatus && (
            <div className={`mt-4 text-center p-3 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitStatus.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
