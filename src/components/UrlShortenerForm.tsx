'use client'

import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Link2, SlidersHorizontal, ArrowRight, Loader2 } from 'lucide-react';
import type { ShortenMode, ShortenedLink, ValidationErrors } from '../types/shortener';
import { BASE_DOMAIN, generateBase62Code, validateUrl, validateAlias, extractHostname } from '@/lib/utils';

export interface UrlShortenerFormRef {
  focusInput: () => void;
  resetForm: () => void;
}

interface UrlShortenerFormProps {
  onSuccess: (link: ShortenedLink) => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const UrlShortenerForm = forwardRef<UrlShortenerFormRef, UrlShortenerFormProps>(
  ({ onSuccess, onToast }, ref) => {
    const [url, setUrl] = useState('');
    const [mode, setMode] = useState<ShortenMode>('auto');
    const [alias, setAlias] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ url?: boolean; alias?: boolean }>({});

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      resetForm: () => {
        setUrl('');
        setAlias('');
        setMode('auto');
        setErrors({});
        setTouched({});
        setTimeout(() => inputRef.current?.focus(), 50);
      },
    }));

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setUrl(val);
      if (touched.url) {
        const check = validateUrl(val);
        setErrors((prev) => ({
          ...prev,
          url: check.isValid ? undefined : check.error,
        }));
      }
    };

    const handleUrlBlur = () => {
      setTouched((prev) => ({ ...prev, url: true }));
      const check = validateUrl(url);
      setErrors((prev) => ({
        ...prev,
        url: check.isValid ? undefined : check.error,
      }));
    };

    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setAlias(val);
      if (touched.alias) {
        const check = validateAlias(val);
        setErrors((prev) => ({
          ...prev,
          alias: check.isValid ? undefined : check.error,
        }));
      }
    };

    const handleAliasBlur = () => {
      setTouched((prev) => ({ ...prev, alias: true }));
      const check = validateAlias(alias);
      setErrors((prev) => ({
        ...prev,
        alias: check.isValid ? undefined : check.error,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Trigger touched state
      setTouched({ url: true, alias: mode === 'custom' });

      // Validate URL
      const urlCheck = validateUrl(url);
      let aliasCheck: { isValid: boolean; error?: string; isReserved?: boolean } = { isValid: true };

      if (mode === 'custom') {
        aliasCheck = validateAlias(alias);
      }

      if (!urlCheck.isValid || !aliasCheck.isValid) {
        setErrors({
          url: urlCheck.error,
          alias: aliasCheck.error,
        });

        if (!urlCheck.isValid) {
          onToast('error', urlCheck.error || 'Please provide a valid URL.');
        } else if (!aliasCheck.isValid) {
          if (aliasCheck.isReserved) {
            onToast('error', `Alias "${alias}" is reserved. Try another name.`);
          } else {
            onToast('error', aliasCheck.error || 'Invalid custom alias.');
          }
        }
        return;
      }

      // Valid form - start simulated submission
      setIsLoading(true);
      setErrors({});

      // Realistic latency simulation (600ms)
      await new Promise((resolve) => setTimeout(resolve, 600));

      const code = mode === 'custom' ? alias.trim() : generateBase62Code(6);
      const shortUrl = `https://${BASE_DOMAIN}/${code}`;
      const hostname = extractHostname(url.trim());

      const newLink: ShortenedLink = {
        id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        originalUrl: url.trim(),
        shortCode: code,
        shortUrl,
        mode,
        createdAt: Date.now(),
        clicks: 0,
        hostname,
      };

      setIsLoading(false);
      onSuccess(newLink);
      onToast('success', 'URL shortened successfully!');
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-2xl border border-neutral-300/90 p-5 sm:p-7 space-y-6 transition-all"
        noValidate
      >
        {/* URL Input */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="url-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Original URL <span className="text-rose-500">*</span>
            </label>
          </div>

        <div className='flex gap-3'>
          <div className="relative flex items-center w-full">
            <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              id="url-input"
              type="url"
              value={url}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              placeholder="https://example.com/your/very/long/url"
              className={`w-full pl-10 pr-4 py-3 bg-neutral-50/60 hover:bg-neutral-50 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 rounded-xl border transition-all outline-none ${
                errors.url
                  ? 'border-rose-400 ring-2 ring-rose-100 focus:border-rose-500'
                  : 'border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10'
              }`}
              disabled={isLoading}
              autoComplete="off"
              spellCheck={false}
            />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-4 text-nowrap text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                  <span>Shortening link...</span>
                </>
              ) : (
                <>
                  <span>Shorten URL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {!!errors.url && (
            <p className="text-xs text-rose-600 font-medium pt-0.5 animate-in fade-in duration-150">
              {errors.url}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setMode(prev => prev === 'custom' ? 'auto' : 'custom');
            if (alias) {
              const check = validateAlias(alias);
              setErrors((prev) => ({ ...prev, alias: check.isValid ? undefined : check.error }));
            }
          }}
          className={`flex items-center justify-center ml-auto gap-2 py-1 px-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            mode === 'custom'
              ? 'bg-gray-300 text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-600" />
          <span className='underline'>Custom link</span>
        </button>

        {/* Custom Alias Input (Conditional) */}
        {mode === 'custom' && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between">
              <label htmlFor="alias-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Custom Link <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-neutral-400 tabular-nums">
                {alias.length}/20 chars
              </span>
            </div>

            <div
              className={`flex items-center rounded-xl border bg-neutral-50/60 hover:bg-neutral-50 focus-within:bg-white overflow-hidden transition-all ${
                errors.alias
                  ? 'border-rose-400 ring-2 ring-rose-100 focus-within:border-rose-500'
                  : 'border-neutral-300 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10'
              }`}
            >
              <span className="pl-3.5 pr-1 text-sm font-mono text-neutral-500 select-none shrink-0">
                {BASE_DOMAIN}/
              </span>
              <input
                id="alias-input"
                type="text"
                value={alias}
                onChange={handleAliasChange}
                onBlur={handleAliasBlur}
                placeholder="summer-sale"
                maxLength={20}
                className="w-full py-3 pr-4 text-sm font-mono text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none"
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {errors.alias ? (
              <p className="text-xs text-rose-600 font-medium pt-0.5 animate-in fade-in duration-150">
                {errors.alias}
              </p>
            ) : (
              <p className="text-[11px] text-neutral-500">
                6–20 characters. Letters, numbers, hyphens, and underscores.
              </p>
            )}
          </div>
        )}
      </form>
    );
  }
);

UrlShortenerForm.displayName = 'UrlShortenerForm';
