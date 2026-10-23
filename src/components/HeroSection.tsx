'use client'

import React from 'react';
import { UrlShortenerForm, UrlShortenerFormRef } from './UrlShortenerForm';
import { ShortenedUrlResult } from './ShortenedUrlResult';
import { RecentLinksHistory } from './RecentLinksHistory';
import type { ShortenedLink } from '../types/shortener';

interface HeroSectionProps {
  currentResult: ShortenedLink | null;
  history: ShortenedLink[];
  onShortenSuccess: (link: ShortenedLink) => void;
  onReset: () => void;
  onClearHistory: () => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  formRef: React.RefObject<UrlShortenerFormRef | null>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentResult,
  history,
  onShortenSuccess,
  onReset,
  onClearHistory,
  onToast,
  formRef,
}) => {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]"
          style={{ textWrap: 'balance' }}
        >
          Shortnd.
        </h1>

        {/* URL Shortening Card Carrier */}
        <div className="mt-10 max-w-2xl mx-auto text-left">
          {currentResult ? (
            <ShortenedUrlResult
              link={currentResult}
              onReset={onReset}
              onToast={onToast}
            />
          ) : (
            <UrlShortenerForm
              ref={formRef}
              onSuccess={onShortenSuccess}
              onToast={onToast}
            />
          )}

          {/* Session history */}
          <RecentLinksHistory
            history={history}
            onClearHistory={onClearHistory}
            onToast={onToast}
          />
        </div>
      </div>
    </section>
  );
};
