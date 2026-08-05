'use client';

import { useCallback, useMemo } from 'react';
import Globe from '@/components/travel/Globe';
import RouteRail from '@/components/travel/RouteRail';
import Dispatch from '@/components/travel/Dispatch';
import { useReadingSpy } from '@/hooks/useReadingSpy';
import { census, deriveEntries } from '@/lib/travel/derive';
import { formatBearing, formatKm } from '@/lib/travel/format';
import type { PaintMarker } from '@/lib/travel/paint';
import type { TravelPageConfig } from '@/types/page';

interface TravelPageProps {
    config: TravelPageConfig;
}

export default function TravelPage({ config }: TravelPageProps) {
    const entries = useMemo(() => deriveEntries(config), [config]);
    const ids = useMemo(() => entries.map((e) => e.id), [entries]);
    const stats = useMemo(() => census(entries), [entries]);

    const { activeId, register, seekTo } = useReadingSpy(ids);

    const activeIndex = useMemo(
        () => entries.findIndex((e) => e.id === activeId),
        [entries, activeId]
    );
    const active = activeIndex >= 0 ? entries[activeIndex] : null;

    const markers = useMemo<PaintMarker[]>(
        () =>
            entries.map((entry) => ({
                coord: entry.coord,
                label: entry.place,
                isDay: entry.isDay,
            })),
        [entries]
    );

    const home = config.home?.coord ?? null;

    const furthest = useMemo(
        () =>
            entries.reduce(
                (best, entry) => (entry.kmFromHome > best.kmFromHome ? entry : best),
                entries[0]
            ),
        [entries]
    );

    const handleGlobeSelect = useCallback(
        (index: number) => {
            const entry = entries[index];
            if (entry) seekTo(entry.id);
        },
        [entries, seekTo]
    );

    if (entries.length === 0) return null;

    const globe = (
        <Globe
            markers={markers}
            activeIndex={activeIndex}
            home={home}
            homeLabel={(config.home?.label || 'HOME').toUpperCase()}
            moment={active ? active.moment : null}
            onSelect={handleGlobeSelect}
            initialRotation={config.globe?.initial ?? [-40, 25]}
            driftDegPerSec={config.globe?.drift_deg_per_sec ?? 1.2}
            graticuleStep={config.globe?.graticule_step ?? 15}
            className="aspect-square w-full"
        />
    );

    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            {/* ------------------------------------------------------ masthead */}
            <header className="animate-fade-up">
                <span className="block h-px w-8 bg-gradient-to-r from-accent to-transparent" />
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent">
                    {config.eyebrow || 'Field Register'}
                </p>
                <h1 className="mt-4 font-serif text-[34px] font-bold leading-[1.1] text-primary lg:text-5xl">
                    {config.headline || config.title}
                </h1>
                {config.standfirst && (
                    <p className="mt-5 max-w-[38rem] font-serif text-[19px] leading-[1.7] text-neutral-600 dark:text-neutral-500">
                        {config.standfirst.trim()}
                    </p>
                )}

                {stats && (
                    <div className="relative mt-9">
                        <span className="block h-px w-full bg-neutral-200 dark:bg-neutral-800" />
                        <p className="absolute left-1/2 -top-2 -translate-x-1/2 whitespace-nowrap bg-background px-4 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                            {stats.entries} entries
                            <Sep />
                            {stats.countries} {stats.countries === 1 ? 'country' : 'countries'}
                            <Sep />
                            {stats.fromYear}—{stats.toYear}
                            <span className="hidden sm:inline">
                                <Sep />
                                Furthest {formatKm(stats.furthestKm)}
                            </span>
                        </p>
                    </div>
                )}
            </header>

            {/* Mobile: the globe is the table of contents, once, then it goes away. */}
            <div className="mt-10 lg:hidden">
                <div className="mx-auto w-[min(74vw,300px)]">{globe}</div>
                <div className="mx-auto mt-4 w-[min(74vw,300px)]">
                    <RouteRail entries={entries} activeIndex={activeIndex} onSelect={seekTo} />
                </div>
            </div>

            {/* --------------------------------------------------------- body */}
            <div className="mt-12 grid lg:mt-16 lg:grid-cols-[336px_minmax(0,1fr)] lg:gap-x-14">
                <div className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-9rem)] lg:self-start">
                    <div className="flex h-full flex-col justify-center">
                        <div className="w-[336px]">{globe}</div>

                        <div className="mt-6 w-[336px]">
                            <RouteRail entries={entries} activeIndex={activeIndex} onSelect={seekTo} />
                        </div>

                        <div className="mt-[18px] w-[336px] space-y-1 text-[11px] uppercase tracking-[0.18em] tabular-nums">
                            <p className="text-neutral-500">
                                {active ? (
                                    <>
                                        {active.place}
                                        {active.local_time && (
                                            <>
                                                <Sep />
                                                {active.local_time} local
                                            </>
                                        )}
                                        <Sep />
                                        Entry {activeIndex + 1} / {entries.length}
                                    </>
                                ) : (
                                    'Scroll to begin'
                                )}
                            </p>
                            {furthest && (
                                <p className="text-neutral-400">
                                    {formatKm(furthest.kmFromHome)} max
                                    <Sep />
                                    {formatBearing(furthest.bearingFromHome)} at furthest
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-20 lg:space-y-28">
                    {entries.map((entry, index) => (
                        <Dispatch
                            key={entry.id}
                            entry={entry}
                            home={home}
                            isLast={index === entries.length - 1}
                            registerRef={(node) => register(entry.id, node)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function Sep() {
    return <span className="mx-1.5 text-accent">·</span>;
}
