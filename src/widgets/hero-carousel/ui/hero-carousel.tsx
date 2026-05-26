'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CoverDto } from '@/entities/catalog/model/types';
import { resolveMediaUrl } from '@/shared/lib/media-url';
import { Button } from '@/shared/ui/button';

const FALLBACK_SLIDES = [
  {
    id: '1',
    title: 'Novedades Exclusivas',
    subtitle: 'Descubre lo último en tecnología y estilo de vida premium.',
    imageUrl: 'https://placehold.co/1600x600/4c1d95/ffffff?text=Novedades',
    linkUrl: '/search',
  },
  {
    id: '2',
    title: 'Ofertas de Temporada',
    subtitle: 'Aprovecha descuentos en productos seleccionados.',
    imageUrl: 'https://placehold.co/1600x600/5b21b6/ffffff?text=Ofertas',
    linkUrl: '/search',
  },
  {
    id: '3',
    title: 'Envío a todo México',
    subtitle: 'Compra hoy y recibe en la puerta de tu casa.',
    imageUrl: 'https://placehold.co/1600x600/6d28d9/ffffff?text=Envio',
    linkUrl: '/search',
  },
];

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string | null;
};

function toSlides(covers: CoverDto[]): Slide[] {
  if (!covers.length) return FALLBACK_SLIDES;
  return covers.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: 'Explora las novedades más recientes de nuestro catálogo.',
    imageUrl: resolveMediaUrl(c.imageUrl),
    linkUrl: c.linkUrl ?? '/search',
  }));
}

export function HeroCarousel({ covers }: { covers: CoverDto[] }) {
  const slides = toSlides(covers);
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const href = slide.linkUrl ?? '/search';

  const prev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <section className="relative overflow-hidden rounded-xl border border-gray-800">
      <div className="relative aspect-[21/9] min-h-[280px] sm:min-h-[360px] md:min-h-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col justify-center px-6 py-12 sm:px-12 md:px-16">
          <span className="mb-3 inline-flex w-fit rounded bg-purple-600/90 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
            Destacado
          </span>
          <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">{slide.title}</h1>
          {slide.subtitle && (
            <p className="mt-4 max-w-xl text-base text-gray-200 sm:text-lg">{slide.subtitle}</p>
          )}
          <div className="mt-8">
            <Button
              asChild
              className="bg-purple-600 px-6 hover:bg-purple-700"
            >
              <Link href={href}>
                Explorar Catálogo
                <ChevronRight className="ml-1 inline h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-purple-500' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
