'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema } from '@/lib/schema';
import { z } from 'zod';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isVerified, setIsVerified] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState(''); // Store the verified code
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(rsvpSchema),
    mode: 'onChange', // Enable real-time validation
  });

  const statusRef = useRef<HTMLDivElement | null>(null);
  const dismissTimerRef = useRef<number | null>(null);

  const nameValue = watch('name');
  const debouncedName = useDebounce(nameValue, 500);

  const searchRsvp = useCallback(
    async (name: string) => {
      if (name && name.length >= 3 && !isVerified) {
        try {
          const res = await fetch(`/api/rsvp/search?name=${encodeURIComponent(name)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.email) {
              setValue('CO/DE', data['CO/DE'] || '');
              setValue('email', data.email);
              setValue('notes', data.notes || '');
              setValue('song', data.song || '');
              setValue('+1', data['+1'] || false);
              setValue('19-Connect', data['19-Connect'] || false);
              setValue('BigDay', data['BigDay'] || false);
              setValue('21-Boat', data['21-Boat'] || false);
              setValue('whatsapp', data.whatsapp || '');
            }
          }
        } catch (error) {
          console.error('Failed to fetch RSVP data', error);
        }
      }
    },
    [setValue, isVerified],
  );

  useEffect(() => {
    searchRsvp(debouncedName);
  }, [debouncedName, searchRsvp]);

  const handleCodeVerification = async () => {
    if (!invitationCode) return;
    setIsVerifying(true);
    setVerificationError(null);
    try {
      const res = await fetch(`/api/rsvp/verify-code?code=${encodeURIComponent(invitationCode)}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Verification data received:', data);
        if (data && data.email) {
          setValue('CO/DE', data['CO/DE'] || invitationCode || 'DEFAULT'); // Use invitation code as fallback
          setValue('name', data.name);
          setValue('email', data.email);
          setValue('notes', data.notes || '');
          setValue('song', data.song || '');
          setValue('+1', data['+1'] || false);
          setValue('19-Connect', data['19-Connect'] || false);
          setValue('BigDay', data['BigDay'] || false);
          setValue('21-Boat', data['21-Boat'] || false);
          setValue('whatsapp', data.whatsapp || '');
          setVerifiedCode(invitationCode); // Store the verified code
          setIsVerified(true);
          console.log('Form populated after verification');
        }
      } else {
        const errorData = await res.json();
        setVerificationError(errorData.error === 'Not Found' ? t('invalidCodeError') : t('errorMessage'));
      }
    } catch (error) {
      console.error('Failed to verify code', error);
      setVerificationError(t('errorMessage'));
    } finally {
      setIsVerifying(false);
    }
  };

  // Allow user to go back and enter another invitation code
  const handleEnterAnotherCode = () => {
    setIsVerified(false);
    setInvitationCode('');
    setVerifiedCode('');
    setSubmitStatus(null);
  };

  const onSubmit = async (data: FormInputs) => {
    console.log('Form submission started with data:', data);
    console.log('Form errors:', errors);
    console.log('Verified code:', verifiedCode);
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (data.honeypot) {
      // treat as success to avoid revealing honeypot
  // don't store honeypot submissions as lastSubmission
  setSubmitStatus({ success: true, message: t('successMessage') });
      setIsSubmitting(false);
      return;
    }

    const submitData = {
      'CO/DE': data['CO/DE'] || 'DEFAULT', // Use a default value if CO/DE is not available
      name: data.name,
      email: data.email,
      notes: data.notes,
      song: data.song,
      '+1': data['+1'],
      '19-Connect': data['19-Connect'],
      'BigDay': data['BigDay'], // Include BigDay field
      '21-Boat': data['21-Boat'],
      whatsapp: data.whatsapp,
      code: verifiedCode, // Include the verified code
    };

    console.log('Submitting data to API:', submitData);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const payload = await res.json();
      console.log('API response:', { status: res.status, payload });
      if (res.ok) {
        // Show success message under the submit button. Keep the form visible
        // so the status message can be seen by the user.
        setSubmitStatus({ success: true, message: t('successMessage') });
        reset();
      } else {
        console.error('API error response:', payload);
        setSubmitStatus({ success: false, message: payload.error || t('errorMessage') });
      }
    } catch (error) {
      console.error('Network or other error:', error);
      setSubmitStatus({ success: false, message: t('errorMessage') });
    } finally {
      setIsSubmitting(false);
    }
  };

  // After showing a status, focus it (for screen readers) and auto-dismiss after 6s
  useEffect(() => {
    // clear any existing timer
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    if (submitStatus) {
      // focus the status so keyboard/screenreader users notice it
      requestAnimationFrame(() => statusRef.current?.focus());

      // auto-dismiss success or error after 6 seconds
      dismissTimerRef.current = window.setTimeout(() => {
        setSubmitStatus(null);
        dismissTimerRef.current = null;
      }, 6000);
    }

    return () => {
      if (dismissTimerRef.current) {
        window.clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [submitStatus]);

  // (undo removed)

  if (!isVerified) {
    return (
      <section
        id="rsvp"
        className="py-20"
      >
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100 text-center">
            <h2 className="text-3xl font-serif text-gray-800 mb-4">{t('title')}</h2>
            <p className="mb-6 text-gray-600">{t('enterCodePrompt')}</p>
            <div className="mb-4 text-left">
              <label htmlFor="invitationCode" className="block text-gray-700 text-sm font-bold mb-2">
                {t('invitationIdLabel')}
              </label>
              <input
                id="invitationCode"
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeVerification()}
                placeholder={t('invitationIdPlaceholder')}
                className="w-full p-3 border border-gray-200 rounded-md"
              />
            </div>
            <button
              onClick={handleCodeVerification}
              disabled={isVerifying || !invitationCode}
              className="w-full p-3 bg-purple-700 text-white font-bold rounded-md hover:bg-purple-800 disabled:bg-gray-400 transition-colors duration-300"
            >
              {isVerifying ? t('verifyingButton') : t('verifyButton')}
            </button>
            {verificationError && (
              <div className="mt-4 text-center p-3 rounded-md bg-red-100 text-red-800">
                {verificationError}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

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
              <div className="flex-shrink-0 text-purple-600 bg-purple-50 p-2 rounded-lg mr-3 mt-1">
                <MusicIcon className="w-5 h-5" />
              </div>
              <span>{t('songInfo')}</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 text-yellow-600 bg-yellow-50 p-2 rounded-lg mr-3 mt-1">
                <StarIcon className="w-5 h-5" />
              </div>
              <span>{t('kidsInfo')}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-100">
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

            {/* WhatsApp number */}
            <div className="mb-4">
              <label htmlFor="whatsapp" className="block text-gray-700 text-sm font-bold mb-2">
                {t('whatsappLabel')}
              </label>
              <input
                id="whatsapp"
                {...register('whatsapp')}
                type="tel"
                placeholder={t('whatsappPlaceholder')}
                className={`w-full p-3 border rounded-md ${errors.whatsapp ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>

            {/* Participation Section */}
            <div className="mb-6">
              <h3 className="text-gray-800 text-lg font-semibold mb-4">{t('participationLabel')}</h3>
              
              {/* 19-Connect */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('19-Connect')}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 text-sm font-bold">{t('connect19Label')}</span>
                </label>
                {errors['19-Connect'] && <p className="text-red-500 text-xs mt-1">{errors['19-Connect'].message}</p>}
              </div>

              {/* BigDay */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('BigDay')}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 text-sm font-bold">{t('bigDayLabel')}</span>
                </label>
                {errors['BigDay'] && <p className="text-red-500 text-xs mt-1">{errors['BigDay'].message}</p>}
              </div>

              {/* +1 */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('+1')}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 text-sm font-bold">{t('plusOneLabel')}</span>
                </label>
                {errors['+1'] && <p className="text-red-500 text-xs mt-1">{errors['+1'].message}</p>}
              </div>

              {/* 21-Boat */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('21-Boat')}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 text-sm font-bold">{t('boat21Label')}</span>
                </label>
                {errors['21-Boat'] && <p className="text-red-500 text-xs mt-1">{errors['21-Boat'].message}</p>}
              </div>
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

            {/* Hidden CO/DE field */}
            <input type="hidden" {...register('CO/DE')} />
            
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
                onClick={() => console.log('Submit button clicked', { 
                  isSubmitting, 
                  verifiedCode, 
                  formErrors: errors,
                  formIsValid: Object.keys(errors).length === 0
                })}
                className="w-full p-3 bg-purple-700 text-white font-bold rounded-md hover:bg-purple-800 disabled:bg-gray-400 transition-colors duration-300"
              >
                {isSubmitting ? t('submittingButton') : t('submitButton')}
              </button>
              {/* Debug info - remove in production */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-2 text-red-600 text-sm">
                  Form errors: {JSON.stringify(errors)}
                </div>
              )}
            </div>
            {/* status message shown directly under the submit button with an action to enter another code */}
            {submitStatus && (
              <div
                ref={statusRef}
                role="status"
                aria-live="polite"
                tabIndex={-1}
                className={`mt-4 p-3 rounded-md flex items-center justify-between ${
                  submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="flex items-center">
                  {/* icon */}
                  {submitStatus.success ? (
                    <svg className="w-5 h-5 mr-3 text-green-800" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3 text-red-800" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 002 0V7zm-1 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm">{submitStatus.message}</span>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleEnterAnotherCode}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50"
                  >
                    enter with another code
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};