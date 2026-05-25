'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';

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
    <form onSubmit={submit} className="mx-auto w-full max-w-2xl flex-1 px-2">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar productos o marcas..."
          className="h-11 w-full rounded-full border-0 bg-gray-900/90 pl-11 text-white shadow-inner placeholder:text-gray-400 focus-visible:ring-purple-400"
          aria-label="Buscar productos o marcas"
        />
      </div>
    </form>
  );
}
