'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';

/** Equivalente Navigation.search → Filter.searchBy (ruta /search). */
export function HeaderSearch() {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} className="hidden max-w-xs flex-1 md:flex">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar productos…"
          className="h-9 pl-9"
          aria-label="Buscar"
        />
      </div>
    </form>
  );
}
