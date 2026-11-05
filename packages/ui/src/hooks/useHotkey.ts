import { useEffect, useRef } from 'react';

export interface HotkeyOptions {
  mod?: boolean;
  allowInInputs?: boolean;
  enabled?: boolean;
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    !!target.closest('[role="dialog"]')
  );
}

export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  { mod = false, allowInInputs = mod, enabled = true }: HotkeyOptions = {},
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (mod !== (event.ctrlKey || event.metaKey)) return;
      if (!mod && (event.altKey || event.ctrlKey || event.metaKey)) return;
      if (!allowInInputs && isTyping(event.target)) return;
      event.preventDefault();
      handlerRef.current(event);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [key, mod, allowInInputs, enabled]);
}
