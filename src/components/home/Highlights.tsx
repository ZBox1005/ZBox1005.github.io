'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { HighlightItem } from '@/types/page';
import { useSwipe } from '@/hooks/useSwipe';

interface HighlightsProps {
    items: HighlightItem[];
    title: string;
    /** Smaller heading, to sit inside the compact mobile card. */
    compact?: boolean;
}

/**
 * Sidebar carousel of recent highlights: a framed photo with a caption panel under it.
 * The active pagination pill doubles as the timer — when its fill animation ends the
 * next card rotates in, so hovering (which pauses the animation) pauses the rotation,
 * and `prefers-reduced-motion` (which removes it) turns auto-rotation off.
 */
export default function Highlights({ items, title, compact = false }: HighlightsProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const swipeHandlers = useSwipe((step) => {
        setActiveIndex((index) => (index + step + items.length) % items.length);
    });

    if (items.length === 0) return null;

    const current = activeIndex % items.length;

    return (
        <section
            aria-roledescription="carousel"
            aria-label={title}
            onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setPaused(true);
            }}
            onPointerLeave={() => setPaused(false)}
        >
            <div className="mb-2.5 flex items-center justify-between gap-3">
                <h2 className={`font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 ${
                    compact ? 'px-1 text-[10px]' : 'text-[11px]'
                }`}>
                    {title}
                </h2>

                {items.length > 1 && (
                    <div className={`flex items-center gap-1 ${compact ? 'pr-1' : ''}`}>
                        {items.map((item, index) => {
                            const isActive = index === current;
                            return (
                                <button
                                    key={`${index}-${item.title}`}
                                    type="button"
                                    aria-label={`${title} ${index + 1} / ${items.length}: ${item.title}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    onClick={() => setActiveIndex(index)}
                                    className="group/pip flex h-4 items-center"
                                >
                                    <span className={`relative block h-1 overflow-hidden rounded-full transition-all duration-300 ${
                                        isActive
                                            ? 'w-5 bg-accent/25'
                                            : 'w-1.5 bg-neutral-300 group-hover/pip:bg-accent/60 dark:bg-neutral-600'
                                    }`}>
                                        {isActive && (
                                            <span
                                                className="highlight-progress absolute inset-0 rounded-full bg-accent"
                                                style={{ animationPlayState: paused ? 'paused' : 'running' }}
                                                onAnimationEnd={() => setActiveIndex((current + 1) % items.length)}
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Every card shares one grid cell: they cross-fade in place and the panel
                keeps the height of the tallest caption, so nothing below it jumps. */}
            <div className="grid touch-pan-y" {...(items.length > 1 ? swipeHandlers : {})}>
                {items.map((item, index) => {
                    const isActive = index === current;
                    return (
                        <a
                            key={`${index}-${item.title}`}
                            href={item.href}
                            target={item.href ? '_blank' : undefined}
                            rel={item.href ? 'noopener noreferrer' : undefined}
                            inert={!isActive}
                            className={`group/hl col-start-1 row-start-1 flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)] transition-[opacity,transform,border-color,box-shadow] duration-500 ease-out hover:border-accent/35 hover:shadow-[0_14px_30px_-18px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 dark:border-white/10 dark:bg-neutral-900 ${
                                isActive ? 'opacity-100' : 'pointer-events-none scale-[0.98] opacity-0'
                            }`}
                        >
                            <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image}
                                    alt={item.alt || item.title}
                                    decoding="async"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/hl:scale-[1.04]"
                                />
                                <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/5 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-sm transition-all duration-1000 ease-out group-hover/hl:left-[115%] group-hover/hl:opacity-100" />

                                {item.tag && (
                                    <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-slate-950/60 px-2 py-1 text-[9px] font-bold uppercase leading-none tracking-[0.14em] text-white ring-1 ring-inset ring-white/15 backdrop-blur-md">
                                        <span className="h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
                                        {item.tag}
                                    </span>
                                )}

                                {item.inset && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={item.inset}
                                        alt=""
                                        decoding="async"
                                        className="absolute right-2 top-2 w-[22%] rotate-[4deg] rounded-[5px] border-2 border-white shadow-[0_8px_18px_-6px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out group-hover/hl:rotate-0 group-hover/hl:scale-[1.08]"
                                    />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col border-t border-neutral-100 bg-gradient-to-br from-white via-white to-neutral-50/80 px-3 py-2.5 dark:border-white/10 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800/80">
                                {(item.date || item.venue) && (
                                    <p className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase leading-none tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
                                        {item.date && <span className="tabular-nums text-accent-dark dark:text-accent">{item.date}</span>}
                                        {item.date && item.venue && <span className="h-0.5 w-0.5 rounded-full bg-current" />}
                                        {item.venue && <span className="truncate">{item.venue}</span>}
                                    </p>
                                )}
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="break-keep text-[12.5px] font-semibold leading-snug text-primary [overflow-wrap:anywhere]">
                                        {item.title}
                                    </h3>
                                    {item.href && (
                                        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-neutral-300 transition-all duration-200 group-hover/hl:-translate-y-0.5 group-hover/hl:translate-x-0.5 group-hover/hl:text-accent dark:text-neutral-400" />
                                    )}
                                </div>
                                {item.description && (
                                    <p className="mt-1 break-keep text-[11px] leading-snug text-neutral-500 [overflow-wrap:anywhere]">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
