'use client'

import { useState, useRef, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ToastContainer } from '@/components/Toast';
import type { ShortenedLink, ToastMessage } from '@/types/shortener';
import type { UrlShortenerFormRef } from '@/components/UrlShortenerForm';

export default function App() {
  const [currentResult, setCurrentResult] = useState<ShortenedLink | null>(null);
  const [history, setHistory] = useState<ShortenedLink[]>(() => {
    try {
      const saved = localStorage.getItem('shortnd_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {

    }
    return [];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const formRef = useRef<UrlShortenerFormRef>(null);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shortnd_history', JSON.stringify(history));
    } catch {
      // Ignore localStorage quotas
    }
  }, [history]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleShortenSuccess = (link: ShortenedLink) => {
    setCurrentResult(link);
    setHistory((prev) => [link, ...prev.filter((item) => item.shortCode !== link.shortCode)]);
  };

  const handleResetForm = () => {
    setCurrentResult(null);
    setTimeout(() => {
      formRef.current?.resetForm();
    }, 50);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('shortnd_history');
    } catch {
      // Ignore
    }
    addToast('info', 'Recent session history cleared.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Main Content Sections */}
      <main className="flex-1 items-center justify-center h-full">
        <HeroSection
          currentResult={currentResult}
          history={history}
          onShortenSuccess={handleShortenSuccess}
          onReset={handleResetForm}
          onClearHistory={handleClearHistory}
          onToast={addToast}
          formRef={formRef}
        />
      </main>

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
