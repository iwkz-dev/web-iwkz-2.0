"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

type ToastOpts = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number; // ms
};

type ToastItem = ToastOpts & { id: number };

const ToastCtx = createContext<{ toast: (opts: ToastOpts) => void } | null>(
  null,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((opts: ToastOpts) => {
    const id = Date.now() + Math.random();
    const item: ToastItem = {
      id,
      variant: opts.variant ?? "default",
      duration: opts.duration ?? 4000,
      title: opts.title,
      description: opts.description,
    };
    setToasts((prev) => [...prev, item]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      item.duration,
    );
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} />
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function Toaster({ toasts }: { toasts: ToastItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[1000] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[260px] rounded-lg px-4 py-3 shadow-lg backdrop-blur
            ${
              t.variant === "destructive"
                ? "bg-red-50/85 border border-red-200 text-red-900"
                : "bg-white/85 border border-gray-200 text-gray-900"
            }`}
        >
          {t.title && <div className="text-sm font-semibold">{t.title}</div>}
          {t.description && <div className="text-xs mt-1">{t.description}</div>}
        </div>
      ))}
    </div>,
    document.body,
  );
}
