import { useEffect } from "react";

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toUpperCase();
      if (handlers[key]) {
        e.preventDefault();
        handlers[key]();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlers]);
}
