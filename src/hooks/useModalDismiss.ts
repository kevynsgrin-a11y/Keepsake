import { useEffect, useRef } from 'react';

// Wires standard dialog behavior onto a modal: Escape closes it, and initial
// focus moves to the first focusable element inside. Pair with an
// onClick={(e) => e.target === e.currentTarget && onClose()} on the backdrop
// element for click-outside-to-close.
export function useModalDismiss<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    const focusable = containerRef.current?.querySelector<HTMLElement>(
      'input, textarea, select, button, [href], [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return containerRef;
}
