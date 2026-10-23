'use client'

import React, { useState } from 'react';
import { Copy, Check, Trash2, Clock, ArrowUpRight } from 'lucide-react';
import type { ShortenedLink } from '@/types/shortener';
import { formatRelativeTime } from '@/lib/utils';

interface RecentLinksHistoryProps {
  history: ShortenedLink[];
  onClearHistory: () => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const RecentLinksHistory: React.FC<RecentLinksHistoryProps> = ({
  history,
  onClearHistory,
  onToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (history.length === 0) {
    return;
  }

  const handleCopy = async (link: ShortenedLink) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link.shortUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = link.shortUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(link.id);
      onToast('success', `Copied ${link.shortCode} to clipboard!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onToast('error', 'Failed to copy URL');
    }
  };

  return (
    <div className="w-full mt-8 pt-6 border-t border-neutral-300/80">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Recent Links in Session ({history.length})
          </h4>
        </div>
        <button
          onClick={onClearHistory}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {history.slice(0, 5).map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-neutral-300/80 hover:border-neutral-300 transition-all text-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-neutral-900 truncate">
                    {item.shortUrl}
                  </span>
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">
                    · {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 truncate mt-0.5" title={item.originalUrl}>
                  {item.originalUrl}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={item.shortUrl}
                  target='_blank'
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  title="Inspect link"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    isCopied
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-800'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-neutral-600" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
