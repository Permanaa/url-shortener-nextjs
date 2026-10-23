import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types/shortener';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-neutral-900 text-neutral-100 rounded-lg shadow-lg border border-neutral-800 text-sm animate-in fade-in slide-in-from-bottom-2 duration-150"
            role="status"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400" />}
            </div>
            <div className="flex-1 text-xs sm:text-sm font-medium leading-tight">
              {toast.message}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-neutral-400 hover:text-white transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
