import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Hero } from '@/components/Hero';

const messages = {
  couple: { name1: 'Maria', name2: 'Chris' },
  hero: { title: "We're getting married!" }
};

describe('Hero', () => {
  it('renders names and title', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Hero />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
    expect(screen.getByText(/Chris/)).toBeInTheDocument();
    expect(screen.getByText(/getting married/i)).toBeInTheDocument();
  });
});
