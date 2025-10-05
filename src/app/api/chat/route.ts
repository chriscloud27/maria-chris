import { NextRequest, NextResponse } from 'next/server';

type Body = { message?: string; locale?: string; name?: string; code?: string };

const SUPPORTED = ['en', 'de', 'es'] as const;

function pickLocale(l?: string) {
  if (!l) return 'en';
  return (SUPPORTED as readonly string[]).includes(l) ? l : 'en';
}

async function loadMessages(locale: string) {
  try {
    const mod = await import(`../../../messages/${locale}.json`);
    return (mod as unknown as { default?: unknown }).default ?? mod;
  } catch {
    const mod = await import('../../../messages/en.json');
    return (mod as unknown as { default?: unknown }).default ?? mod;
  }
}

function getString(obj: unknown, path: string[]): string | undefined {
  if (typeof obj !== 'object' || obj === null) return undefined;
  let cur: unknown = obj;
  for (const p of path) {
    if (typeof cur === 'object' && cur !== null && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === 'string' ? cur : undefined;
}

function buildRepliesFromMessage(message: string, messages: unknown) {
  const text = message.toLowerCase();

  if (text.includes('rsvp') || text.includes('confirm') || text.includes('confirmar') || text.includes('zusage')) {
    return [{ type: 'link', text: getString(messages, ['rsvp', 'formTitle']) || 'RSVP', url: '/rsvp' }];
  }

  if (text.includes('hotel') || text.includes('hotels') || text.includes('hoteles') || text.includes('stay') || text.includes('where')) {
    return [{ type: 'text', text: getString(messages, ['hotels', 'subtitle']) || 'See hotel options' }, { type: 'link', text: getString(messages, ['hotels', 'seeMore']) || 'See more', url: '/hotels' }];
  }

  if (text.includes('meal') || text.includes('vegetarian') || text.includes('vegan')) {
    return [{ type: 'open_rsvp', text: getString(messages, ['rsvp', 'formSubtitle']) || 'Open RSVP to update meal preferences', url: '/rsvp' }];
  }

  if (text.includes('attire') || text.includes('dress') || text.includes('kleid') || text.includes('atuendo')) {
    return [{ type: 'text', text: getString(messages, ['details', 'attireNote']) || 'See the attire section' }, { type: 'link', text: getString(messages, ['details', 'attireButtonText']) || 'See more', url: '/attire' }];
  }

  if (text.includes('faq') || text.includes('question') || text.includes('pregunt') || text.includes('frage')) {
    return [{ type: 'link', text: getString(messages, ['faq', 'title']) || 'FAQ', url: '/faq' }];
  }

  // fallback
  const fallback = getString(messages, ['chatbot', 'no_match']) || "Sorry, I couldn't find an answer.";
  const fallbackHelp = getString(messages, ['chatbot', 'fallback_whatsapp']) || 'Still need help? Join our WhatsApp group.';
  return [{ type: 'text', text: fallback }, { type: 'text', text: fallbackHelp }];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const locale = pickLocale(body.locale);
    const messages = await loadMessages(locale);
    const incoming = (body.message || '').toString();

    if (!incoming) return NextResponse.json({ ok: false, error: 'no message' }, { status: 400 });

    const replies = buildRepliesFromMessage(incoming, messages);
    return NextResponse.json({ ok: true, replies });
  } catch {
    return NextResponse.json({ ok: false, error: 'unknown error' }, { status: 500 });
  }
}
