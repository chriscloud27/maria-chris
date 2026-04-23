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
  formState: { errors },
    watch,
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(rsvpSchema),
    mode: 'onChange', // Enable real-time validation
  });

  const statusRef = useRef<HTMLDivElement | null>(null);

  const nameValue = watch('name');
  const debouncedName = useDebounce(nameValue, 500);

  const searchRsvp = useCallback(
    async (name: string) => {
      if (name && name.length >= 3 && !isVerified) {
        try {
          const res = await fetch(`/api/rsvp/search?name=${encodeURIComponent(name)}`);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              setValue('notes', data.notes || '');
              setValue('+1', data['+1'] || false);
              setValue('RSVP-DE', data['RSVP-DE'] || false);
              setValue('kids', data.kids || false);
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
        if (data) {
          setValue('name', data.name);
          setValue('notes', data.notes || '');
          setValue('+1', data['+1'] || false);
          setValue('RSVP-DE', data['RSVP-DE'] || false);
          setValue('kids', data.kids || false);
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
      name: data.name,
      notes: data.notes,
      '+1': data['+1'],
      'RSVP-DE': data['RSVP-DE'],
      kids: data.kids,
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
        // Show success message under the submit button. Keep the form values
        // intact so the user can verify what was sent.
        setSubmitStatus({ success: true, message: t('successMessage') });
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
    // When submitStatus changes, focus the status region so screenreaders
    // and keyboard users notice it. Do NOT auto-dismiss - leave the status
    // visible until the user takes action (for example, using the "enter with
    // another code" control).
    if (submitStatus) {
      requestAnimationFrame(() => statusRef.current?.focus());
    }
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
    <section id="rsvp" className="pt-32 pb-20">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-start">
        <div className="text-gray-700">
          <h2 className="text-4xl font-serif text-gray-800 mb-4">{t('title')}</h2>
          <p className="mb-8">{t('invitation')}</p>

          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 text-purple-600 bg-purple-50 p-2 rounded-lg mr-3 mt-1">
                <MusicIcon className="w-5 h-5" />
              </div>
              <span>{t('notesInfo')}</span>
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

            {/* Email removed */}

            {/* Participation Section */}
            <div className="mb-6">
              <h3 className="text-gray-800 text-lg font-semibold mb-4">{t('participationLabel')}</h3>

              {/* Wedding Party headline + checkbox */}
              <div className="mb-4">
                <h4 className="text-gray-700 text-md font-semibold mb-2">{t('bigDayLabel')}</h4>
                <div className="pl-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('RSVP-DE')}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 text-sm">{t('imComingLabel')}</span>
                  </label>
                  {errors['RSVP-DE'] && <p className="text-red-500 text-xs mt-1">{errors['RSVP-DE'].message}</p>}
                </div>
              </div>

              {/* +1 */}
              <div className="mb-3 pl-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('+1')}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 text-sm">{t('plusOneLabel')}</span>
                </label>
                {errors['+1'] && <p className="text-red-500 text-xs mt-1">{errors['+1'].message}</p>}
              </div>

              {/* Kids */}
              <div className="mb-3 pl-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('kids')}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 text-sm">{t('kidsLabel')}</span>
                </label>
                {errors.kids && <p className="text-red-500 text-xs mt-1">{errors.kids.message}</p>}
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

            {/* CO/DE removed */}
            
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
                    {t('enterAnotherCode')}
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