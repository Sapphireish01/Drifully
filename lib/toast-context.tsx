"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
  toasts: ToastItem[];
}

/* ─── Context ────────────────────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 4500; // ms

/* ─── Provider ───────────────────────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const recentToastsRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const trimmed = message?.trim();
      if (!trimmed) return;

      const dedupeKey = `${type}:${trimmed}`;
      const now = Date.now();
      const lastShown = recentToastsRef.current.get(dedupeKey);

      // Debounce: ignore identical toast triggered within last 1800ms
      if (lastShown && now - lastShown < 1800) {
        return;
      }
      recentToastsRef.current.set(dedupeKey, now);

      // Clean up old entries from dedupe cache
      if (recentToastsRef.current.size > 50) {
        recentToastsRef.current.forEach((time, key) => {
          if (now - time > 5000) recentToastsRef.current.delete(key);
        });
      }

      const id = `toast-${now}-${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = { id, type, message: trimmed, createdAt: now };

      setToasts((prev) => {
        // Prevent duplicate active toast with identical message
        if (prev.some((t) => t.type === type && t.message === trimmed)) {
          return prev;
        }
        // Cap at 5 visible toasts — remove oldest if over limit
        const next = [...prev, item];
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });

      timersRef.current[id] = setTimeout(() => dismissToast(id), TOAST_DURATION);
    },
    [dismissToast]
  );

  // Bridge for Axios interceptor and external callers (outside React tree)
  useEffect(() => {
    (window as any).__showAdminToast = showToast;
    (window as any).__showToast = showToast;
    return () => {
      delete (window as any).__showAdminToast;
      delete (window as any).__showToast;
    };
  }, [showToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────────────────── */

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
