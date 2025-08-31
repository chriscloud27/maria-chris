'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema } from '@/lib/schema';
import { z } from 'zod';
import { useState, useEffect, useCallback } from 'react';
import { CutleryIcon } from './icons/CutleryIcon';
import { MusicIcon } from './icons/MusicIcon';
import { StarIcon } from './icons/StarIcon';

type SchemaInputs = z.infer<typeof rsvpSchema>;
type FormInputs = SchemaInputs & {
  // Honeypot for spam protection
  honeypot?: string;
};

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const Rsvp = () => {
  const t = useTranslations('rsvp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { rsvp: 'Yes' },
  });

  const nameValue = watch('name');
  const debouncedName = useDebounce(nameValue, 500);

  const searchRsvp = useCallback(
    async (name: string) => {
      if (name && name.length >= 3) {
        try {
          const res = await fetch(`/api/rsvp/search?name=${encodeURIComponent(name)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.email) {
              setValue('email', data.email);
              setValue('rsvp', data.rsvp);
              setValue('notes', data.notes);
              setValue('song', data.song);
              setValue('boat', data.boat);
            }
          }
        } catch (error) {
          console.error('Failed to fetch RSVP data', error);
        }
      }
    },
    [setValue],
  );

  useEffect(() => {
    searchRsvp(debouncedName);
  }, [debouncedName, searchRsvp]);
  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (data.honeypot) {
      // treat as success to avoid revealing honeypot
      setSubmitStatus({ success: true, message: t('successMessage') });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          rsvp: data.rsvp,
          notes: data.notes,
          song: data.song,
          boat: data.boat,
        }),
      });

      const payload = await res.json();
      if (res.ok) {
        setSubmitStatus({ success: true, message: t('successMessage') });
        reset();
      } else {
        setSubmitStatus({ success: false, message: payload.error || t('errorMessage') });
      }
    } catch {
      setSubmitStatus({ success: false, message: t('errorMessage') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="py-20 bg-stone-50"
      style={{ backgroundImage: "url('/background-small.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name (Title) */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                {t('nameLabel')}
              </label>
              <input
                id="name"
                {...register('name')}
                type="text"
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
                id="email"
                {...register('email')}
                type="email"
                className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* RSVP select */}
            <div className="mb-4">
              <label htmlFor="rsvp" className="block text-gray-700 text-sm font-bold mb-2">
                {t('attendanceLabel')}
              </label>
              <select
                id="rsvp"
                {...register('rsvp')}
                className={`w-full p-3 border rounded-md bg-white ${errors.rsvp ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="Yes">{t('attendanceYes')}</option>
                <option value="No">{t('attendanceNo')}</option>
                <option value="Maybe">{t('attendanceMaybe')}</option>
              </select>
              {errors.rsvp && <p className="text-red-500 text-xs mt-1">{errors.rsvp.message}</p>}
            </div>

            {/* Notes (rich text) */}
            <div className="mb-6">
              <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">
                {t('notesLabel')}
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder={t('notesPlaceholder')}
                className="w-full p-3 border border-gray-200 rounded-md"
              />
              {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
            </div>

            {/* Song request */}
            <div className="mb-6">
              <label htmlFor="song" className="block text-gray-700 text-sm font-bold mb-2">
                {t('songLabel')}
              </label>
              <input
                id="song"
                {...register('song')}
                type="text"
                placeholder={t('songPlaceholder')}
                className={`w-full p-3 border rounded-md ${errors.song ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.song && <p className="text-red-500 text-xs mt-1">{errors.song.message}</p>}
            </div>

            {/* Boat party checkbox */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('boat')}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 text-sm font-bold">{t('boatLabel')}</span>
              </label>
              {errors.boat && <p className="text-red-500 text-xs mt-1">{errors.boat.message}</p>}
            </div>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="honeypot" className="sr-only">
                Leave this field empty
              </label>
              <input id="honeypot" {...register('honeypot')} type="text" tabIndex={-1} autoComplete="off" />
            </div>

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
            <div
              className={`mt-4 text-center p-3 rounded-md ${
                submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};