'use client';

import { Blocks } from './Blocks';
import { FigureBlock } from './Blocks';
import GlobeSeal from './GlobeSeal';
import { greatCircleKm, initialBearing, type LngLat } from '@/lib/travel/globe';
import {
    formatBearing,
    formatCoord,
    formatDate,
    formatKm,
} from '@/lib/travel/format';
import type { DerivedEntry } from '@/lib/travel/derive';

interface DispatchProps {
    entry: DerivedEntry;
    home: LngLat | null;
    isLast: boolean;
    registerRef: (node: HTMLElement | null) => void;
}

const DATELINE = 'font-mono text-[10px] tracking-[0.03em] tabular-nums text-neutral-400';

export default function Dispatch({ entry, home, isLast, registerRef }: DispatchProps) {
    const hasBlocks = Boolean(entry.blocks && entry.blocks.length > 0);

    const closing = isLast && home
        ? {
              km: greatCircleKm(entry.coord, home),
              bearing: initialBearing(entry.coord, home),
          }
        : null;

    return (
        <article
            ref={registerRef}
            id={`entry-${entry.id}`}
            className="scroll-mt-28 animate-fade-up"
            aria-labelledby={`headline-${entry.id}`}
        >
            <div className="flex gap-4">
                {/* The sticky instrument has no room on narrow screens, so each
                    entry carries a small globe frozen on its own coordinates. */}
                <GlobeSeal
                    coord={entry.coord}
                    home={home}
                    size={72}
                    className="mt-0.5 flex-shrink-0 lg:hidden"
                />

                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        {entry.place}
                        {entry.region ? `, ${entry.region}` : ''}
                    </p>

                    <p className={`${DATELINE} mt-1.5`}>
                        {formatCoord(entry.coord)}
                        <Sep />
                        {formatDate(entry.date)}
                        {entry.local_time && (
                            <>
                                <Sep />
                                {entry.local_time}
                            </>
                        )}
                        <Sep />
                        {entry.light}
                    </p>

                    {home && (
                        <p className={`${DATELINE} mt-1`}>
                            {formatKm(entry.kmFromHome)} FROM HOME
                            <Sep />
                            BEARING {formatBearing(entry.bearingFromHome)}
                        </p>
                    )}
                </div>
            </div>

            <div className="mb-5 mt-3 h-px w-full bg-gradient-to-r from-accent/60 via-accent/15 to-transparent" />

            {entry.headline && (
                <h2
                    id={`headline-${entry.id}`}
                    className="font-serif text-[26px] font-bold leading-[1.18] text-primary sm:text-[30px]"
                >
                    {entry.headline}
                </h2>
            )}

            {hasBlocks ? (
                <div className="mt-4">
                    <Blocks blocks={entry.blocks!} />
                </div>
            ) : (
                <>
                    {entry.note && (
                        <p className="mt-4 font-serif text-[17px] leading-[1.75] text-neutral-700 dark:text-neutral-300">
                            {entry.note.trim()}
                        </p>
                    )}
                    {entry.photo && (
                        <div className="mt-6">
                            <FigureBlock
                                block={{
                                    kind: 'figure',
                                    layout: 'full',
                                    ratio: entry.photo.ratio,
                                    images: [entry.photo.src],
                                    alt: entry.photo.alt,
                                    caption: entry.photo.caption,
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* NEXT rule — authored zero times */}
            <div className="mt-14">
                <div className="h-px w-full bg-gradient-to-r from-accent/40 via-neutral-200 to-transparent dark:via-neutral-800" />
                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] tabular-nums text-neutral-500">
                    {closing ? (
                        <>
                            End of register
                            <Sep />
                            {formatKm(closing.km)} home
                            <Sep />
                            Bearing {formatBearing(closing.bearing)}
                        </>
                    ) : entry.next ? (
                        <>
                            Next
                            <Sep />
                            {formatKm(entry.next.km)} {entry.next.compass.toLowerCase()}
                            <Sep />
                            to {entry.next.place}
                        </>
                    ) : null}
                </p>
            </div>
        </article>
    );
}

function Sep() {
    return <span className="mx-1.5 text-accent">·</span>;
}
