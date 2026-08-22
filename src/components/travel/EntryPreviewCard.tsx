'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/travel/format';
import type { DerivedEntry } from '@/lib/travel/derive';

function previewSource(entry: DerivedEntry): string | null {
    if (entry.photo?.src) return entry.photo.src;

    const figure = entry.blocks?.find((block) => block.kind === 'figure');
    return figure?.kind === 'figure' ? figure.images[0] || null : null;
}

export default function EntryPreviewCard({ entry }: { entry: DerivedEntry }) {
    const source = useMemo(() => previewSource(entry), [entry]);
    const [failed, setFailed] = useState(false);

    useEffect(() => setFailed(false), [source]);

    return (
        <div className="pointer-events-none w-60 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-white/70 bg-white/92 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.55)] ring-1 ring-black/[0.05] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/92 dark:ring-white/[0.04]">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                {source && !failed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={source}
                        alt=""
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        onError={() => setFailed(true)}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_72%_22%,rgba(212,165,98,0.28),transparent_34%),linear-gradient(145deg,var(--neutral-50),var(--neutral-100))] dark:bg-[radial-gradient(circle_at_72%_22%,rgba(228,185,118,0.18),transparent_34%),linear-gradient(145deg,var(--neutral-900),var(--neutral-800))]">
                        <span className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full border border-accent/20" />
                        <span className="absolute -bottom-5 right-6 h-24 w-24 rounded-full border border-accent/15" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                            <MapPin className="h-5 w-5 text-accent" />
                            <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em]">
                                Field note
                            </span>
                        </div>
                    </div>
                )}
                <span className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute bottom-2.5 left-3 right-3 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/85">
                    {entry.region || 'Travel register'}
                </span>
            </div>

            <div className="p-3.5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent-dark dark:text-accent">
                            {formatDate(entry.date)}
                        </p>
                        <p className="mt-1 truncate font-serif text-lg font-bold leading-tight text-primary">
                            {entry.place}
                        </p>
                    </div>
                    <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-background">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                </div>
                {entry.headline && (
                    <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-neutral-500">
                        {entry.headline}
                    </p>
                )}
                <p className="mt-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    Click point to open
                </p>
            </div>
        </div>
    );
}
