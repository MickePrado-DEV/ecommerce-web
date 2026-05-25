'use client';

import { useEffect } from 'react';

/** Bloquea scroll en html/body (equivalente Alpine overflow-hidden en drawer). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const body = document.body;
    html.classList.add('overflow-hidden');
    body.classList.add('overflow-hidden');
    return () => {
      html.classList.remove('overflow-hidden');
      body.classList.remove('overflow-hidden');
    };
  }, [locked]);
}
