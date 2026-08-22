'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Compass,
    MousePointer2,
    Sparkles,
} from 'lucide-react';
import Dispatch from '@/components/travel/Dispatch';
import EntryPreviewCard from '@/components/travel/EntryPreviewCard';
import Globe from '@/components/travel/Globe';
import PlacePicker from '@/components/travel/PlacePicker';
import { census, deriveEntries } from '@/lib/travel/derive';
import type { PaintMarker } from '@/lib/travel/paint';
import type { TravelPageConfig } from '@/types/page';

interface TravelPageProps {
    config: TravelPageConfig;
}

export default function TravelPage({ config }: TravelPageProps) {
    const entries = useMemo(() => deriveEntries(config), [config]);
    const stats = useMemo(() => census(entries), [entries]);
    const photoCount = useMemo(
        () =>
            entries.reduce((total, entry) => {
                if (entry.blocks?.length) {
                    return total + entry.blocks.reduce((count, block) => {
                        if (block.kind === 'gallery' || block.kind === 'figure') {
                            return count + block.images.length;
                        }
                        return count;
                    }, 0);
                }
                return total + (entry.photo ? 1 : 0);
            }, 0),
        [entries]
    );
    const panelRef = useRef<HTMLDivElement>(null);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [direction, setDirection] = useState(1);

    const selectedIndex = useMemo(
        () => entries.findIndex((entry) => entry.id === selectedId),
        [entries, selectedId]
    );
    const selected = selectedIndex >= 0 ? entries[selectedIndex] : null;
    const hovered = hoverIndex >= 0 ? entries[hoverIndex] : null;
    const home = config.home?.coord ?? null;

    const markers = useMemo<PaintMarker[]>(
        () => entries.map((entry) => ({ coord: entry.coord, label: entry.place })),
        [entries]
    );

    const latest = entries[entries.length - 1] ?? null;

    useEffect(() => {
        const readHash = () => {
            const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
            if (entries.some((entry) => entry.id === id)) setSelectedId(id);
        };

        readHash();
        window.addEventListener('hashchange', readHash);
        return () => window.removeEventListener('hashchange', readHash);
    }, [entries]);

    const selectIndex = useCallback(
        (index: number, scrollOnMobile = true) => {
            const entry = entries[index];
            if (!entry) return;

            setDirection(selectedIndex < 0 || index >= selectedIndex ? 1 : -1);
            setSelectedId(entry.id);
            setHoverIndex(-1);

            const nextUrl = `${window.location.pathname}${window.location.search}#${entry.id}`;
            window.history.replaceState(null, '', nextUrl);

            if (scrollOnMobile && window.innerWidth < 1024) {
                window.requestAnimationFrame(() => {
                    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
        },
        [entries, selectedIndex]
    );

    const clearSelection = useCallback(() => {
        setSelectedId(null);
        setHoverIndex(-1);
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }, []);

    if (entries.length === 0) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="animate-fade-up">
                <span className="block h-px w-8 bg-gradient-to-r from-accent to-transparent" />
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent">
                    {config.eyebrow || 'Field Register'}
                </p>
                <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <div>
                        <h1 className="font-serif text-[34px] font-bold leading-[1.1] text-primary lg:text-5xl">
                            {config.headline || config.title}
                        </h1>
                        {config.standfirst && (
                            <p className="mt-5 max-w-[42rem] font-serif text-[19px] leading-[1.7] text-neutral-600 dark:text-neutral-500">
                                {config.standfirst.trim()}
                            </p>
                        )}
                    </div>

                    {stats && (
                        <div className="grid grid-cols-3 gap-5 border-t border-neutral-200 pt-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0 dark:border-neutral-800">
                            <Stat value={String(stats.entries).padStart(2, '0')} label={stats.entries === 1 ? 'Destination' : 'Destinations'} />
                            <Stat value={String(photoCount).padStart(2, '0')} label="Originals" />
                            <Stat
                                value={stats.fromYear === stats.toYear ? stats.fromYear : `${stats.fromYear}—${stats.toYear.slice(2)}`}
                                label={stats.fromYear === stats.toYear ? 'Year' : 'Years'}
                            />
                        </div>
                    )}
                </div>
            </header>

            <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.1fr)] lg:gap-10 xl:grid-cols-[30rem_minmax(0,1fr)]">
                <aside className="min-w-0 lg:sticky lg:top-24">
                    <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/70 to-white p-4 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] sm:p-5 dark:border-white/10 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-800/75">
                        <span className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
                        <span className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-primary/5 blur-3xl dark:bg-accent/[0.04]" />

                        <div className="relative flex items-start justify-between gap-4 px-1">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent-dark dark:text-accent">
                                    <Compass className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                                        Interactive atlas
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-400">
                                        Drag to rotate · select a point
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full border border-neutral-200/80 bg-white/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:border-white/10 dark:bg-white/[0.03]">
                                {selected ? `${selectedIndex + 1} / ${entries.length}` : 'Explore'}
                            </span>
                        </div>

                        <div className="relative mx-auto mt-2 w-full max-w-[27rem]">
                            <Globe
                                markers={markers}
                                activeIndex={selectedIndex}
                                home={home}
                                homeLabel={(config.home?.label || 'HOME').toUpperCase()}
                                onSelect={(index) => selectIndex(index)}
                                onHoverChange={setHoverIndex}
                                initialRotation={config.globe?.initial ?? [-40, 25]}
                                driftDegPerSec={config.globe?.drift_deg_per_sec ?? 1.2}
                                graticuleStep={config.globe?.graticule_step ?? 15}
                                className="aspect-square w-full"
                            />

                            <AnimatePresence>
                                {hovered && (
                                    <motion.div
                                        key={hovered.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-3 left-3 z-20 hidden lg:block"
                                    >
                                        <EntryPreviewCard entry={hovered} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative mx-auto -mt-1 flex w-fit items-center gap-2 rounded-full border border-neutral-200/80 bg-white/75 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-neutral-400 backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                            <MousePointer2 className="h-3 w-3 text-accent" />
                            Hover to preview · click to open
                        </div>
                    </div>

                    <PlacePicker
                        entries={entries}
                        selectedIndex={selectedIndex}
                        onSelect={selectIndex}
                        onPreview={setHoverIndex}
                        onClear={clearSelection}
                    />
                </aside>

                <div ref={panelRef} className="min-h-[38rem] min-w-0 scroll-mt-24" aria-live="polite">
                    <AnimatePresence mode="wait" custom={direction}>
                        {selected ? (
                            <motion.div
                                key={selected.id}
                                custom={direction}
                                initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction > 0 ? -18 : 18 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200/90 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)] sm:p-7 dark:border-white/10 dark:bg-neutral-900">
                                    <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
                                    <Dispatch
                                        entry={selected}
                                        home={home}
                                        isLast={selectedIndex === entries.length - 1}
                                        focused
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.section
                                key="travel-empty"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.28 }}
                                className="relative flex min-h-[38rem] overflow-hidden rounded-[2rem] border border-dashed border-neutral-300/90 bg-gradient-to-br from-neutral-50/80 via-white to-neutral-50/50 px-6 py-12 sm:px-10 dark:border-white/15 dark:from-neutral-900/70 dark:via-neutral-900 dark:to-neutral-800/60"
                            >
                                <span className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-accent/15" />
                                <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-accent/10" />
                                <span className="pointer-events-none absolute bottom-10 left-10 h-px w-28 rotate-[-24deg] bg-gradient-to-r from-accent/50 to-transparent" />

                                <div className="relative m-auto max-w-md text-center">
                                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/[0.08] text-accent-dark shadow-[0_12px_35px_-24px_rgba(15,23,42,0.45)] dark:text-accent">
                                        <Sparkles className="h-5 w-5" />
                                    </span>
                                    <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent">
                                        A place is waiting
                                    </p>
                                    <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary sm:text-4xl">
                                        Choose a place to begin.
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
                                        Hover for a glimpse, then select a marker to open its complete photographic story.
                                    </p>

                                    <div className="mt-8 grid grid-cols-2 gap-2 text-left">
                                        <Metric label="Latest destination" value={latest?.place || '—'} />
                                        <Metric label="Archive" value={`${String(photoCount).padStart(2, '0')} original photographs`} />
                                    </div>
                                    <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                                        Nothing is preloaded · the gallery follows your selection
                                    </p>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <p className="font-serif text-2xl font-bold tabular-nums text-primary">{value}</p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{label}</p>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-neutral-200/80 bg-white/65 px-3 py-3 dark:border-white/[0.08] dark:bg-white/[0.025]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{label}</p>
            <p className="mt-1.5 truncate text-xs font-semibold text-primary">{value}</p>
        </div>
    );
}
