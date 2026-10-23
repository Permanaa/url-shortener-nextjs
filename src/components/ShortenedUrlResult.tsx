'use client'

import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import type { ShortenedLink } from '@/types/shortener';
import { formatRelativeTime } from '@/lib/utils';

interface ShortenedUrlResultProps {
  link: ShortenedLink;
  onReset: () => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ShortenedUrlResult: React.FC<ShortenedUrlResultProps> = ({
  link,
  onReset,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link.shortUrl);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = link.shortUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onToast('success', 'Short URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onToast('error', 'Could not copy automatically. Please select and copy manually.');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-300/90 p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Your link is ready</h3>
          </div>
        </div>

        {/* Clean unboxed metadata separator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
          <span>{link.mode === 'custom' ? 'Custom Slug' : 'Auto Generated'}</span>
          <span aria-hidden="true">·</span>
          <span>{formatRelativeTime(link.createdAt)}</span>
        </div>
      </div>

      {/* Main Short Link Box */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Shortened Link
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-300/80 font-mono text-sm sm:text-base font-semibold text-neutral-900 overflow-hidden">
            <span className="truncate select-all">{link.shortUrl}</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Original Destination Details */}
      <div className="p-3.5 bg-neutral-50/70 rounded-xl border border-neutral-300/70 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Target Destination</span>
          <span className="font-mono">{link.hostname}</span>
        </div>
        <div className="text-xs font-medium text-neutral-700 truncate select-all" title={link.originalUrl}>
          {link.originalUrl}
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-neutral-600" />
          <span>Shorten Another URL</span>
        </button>
      </div>
    </div>
  );
};
