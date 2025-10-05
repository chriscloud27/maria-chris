"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';

type Message = { from: 'user' | 'bot'; text: string };

export default function Chatbot() {
  const t = useTranslations('chatbot');
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (!started) return;
    // greet on start
    if (messages.length === 0) {
      const greeting = t('welcome_greeting', { name: name ? name : '' });
      setMessages([{ from: 'bot', text: greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, started]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, locale, name, code }),
      });
      const data = (await res.json()) as { replies?: { text?: string }[]; reply?: string; error?: string };
      const botText = Array.isArray(data.replies) ? data.replies.map((r) => r.text || '').join('\n') : data.reply || data.error || t('no_match');
      const botMsg: Message = { from: 'bot', text: botText };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      console.error('Chat send error', err);
      setMessages((m) => [...m, { from: 'bot', text: t('networkError') || 'Network error. Try again later.' }]);
    }
  }

  function startChat() {
    setStarted(true);
    setMessages([]);
  }

  return (
    <div>
      <button
        aria-label={open ? t('closeButton') : t('openButton')}
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-200"
        title={open ? t('closeButton') : t('openButton')}
      >
        {open ? (
          // X icon when open
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          // Chat/whale-like icon when closed
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
  <div className="fixed bottom-5 right-5 w-11/12 sm:w-80 max-w-full h-[420px] md:h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-60 flex flex-col">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
            {/* whale icon on the left */}
            <svg className="h-6 w-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 15c2-4 7-6 11-5s6 5 8 6c-2.5 0-6 1-8-1s-6-2-11 0z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8" cy="9" r="1" fill="currentColor" />
            </svg>
            <div className="font-semibold">{t('title_short')}</div>
          </div>

          {!started ? (
            <div className="p-4 flex-1 overflow-auto">
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">{t('intro')}</p>

              <div className="flex gap-2 flex-wrap mb-3">
                {(() => {
                  const chips: React.ReactNode[] = [];
                  for (let i = 0; i < 10; i++) {
                    try {
                      const ex = t(`examples.${i}`);
                      chips.push(
                        <button
                          key={i}
                          onClick={() => {
                            setInput(ex);
                            setStarted(true);
                            setMessages([{ from: 'bot', text: t('welcome_greeting', { name: name ? name : '' }) }]);
                          }}
                          className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                        >
                          {ex}
                        </button>
                      );
                    } catch {
                      break;
                    }
                  }
                  return chips;
                })()}
              </div>

              <div className="space-y-2 mb-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('askName')} className="w-full px-3 py-2 border rounded" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('askCode')} className="w-full px-3 py-2 border rounded" />
              </div>

              <div className="flex justify-end">
                <button onClick={startChat} className="px-3 py-2 bg-blue-600 text-white rounded">{t('startButton')}</button>
              </div>
            </div>
          ) : (
            <>
              <div ref={listRef} className="p-3 flex-1 overflow-auto space-y-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-md ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Back to menu button under latest message */}
              <div className="p-3 border-t bg-transparent">
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setStarted(false);
                      setMessages([]);
                      setInput('');
                    }}
                    className="text-sm px-3 py-2 bg-gray-100 rounded-md"
                    aria-label={t('back_to_menu')}
                  >
                    {t('back_to_menu')}
                  </button>
                </div>
              </div>

              <div className="p-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                  placeholder={t('placeholder')}
                  className="flex-1 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 bg-transparent outline-none"
                />
                <button onClick={send} className="p-2 rounded-md bg-blue-600 text-white">
                  {t('send')}
                </button>
              </div>
              <div className="p-3 border-t">
                <a href="https://chat.whatsapp.com/CDWsUTuLmZV5hVYfmcs4Hy" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-green-600 hover:underline">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#16A34A" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t('fallback_whatsapp')}
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
