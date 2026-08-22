'use client';

import { MapPin, RotateCcw } from 'lucide-react';
import { formatMonthYear } from '@/lib/travel/format';
import type { DerivedEntry } from '@/lib/travel/derive';

interface PlacePickerProps {
    entries: DerivedEntry[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onPreview: (index: number) => void;
    onClear?: () => void;
}

export default function PlacePicker({
    entries,
    selectedIndex,
    onSelect,
    onPreview,
    onClear,
}: PlacePickerProps) {
    return (
        <div className="mt-4 min-w-0 max-w-full">
            <div className="mb-2.5 flex items-center justify-between px-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Place index
                </p>
                <div className="flex items-center gap-2.5">
                    <p className="text-[10px] font-medium tabular-nums text-neutral-400">
                        {entries.length.toString().padStart(2, '0')} {entries.length === 1 ? 'stop' : 'stops'}
                    </p>
                    {selectedIndex >= 0 && onClear && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="inline-flex h-7 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-500 shadow-sm transition-all hover:border-accent/35 hover:text-accent dark:border-white/10 dark:bg-neutral-900"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Atlas
                        </button>
                    )}
                </div>
            </div>

            <div
                className={`flex snap-x gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0 ${
                    entries.length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'
                }`}
                role="listbox"
                aria-label="Travel locations"
            >
                {entries.map((entry, index) => {
                    const isSelected = index === selectedIndex;
                    const fillsOddLastRow =
                        entries.length > 1 &&
                        entries.length % 2 === 1 &&
                        index === entries.length - 1;

                    return (
                        <button
                            key={entry.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => onSelect(index)}
                            onMouseEnter={() => onPreview(index)}
                            onMouseLeave={() => onPreview(-1)}
                            onFocus={() => onPreview(index)}
                            onBlur={() => onPreview(-1)}
                            className={`group relative snap-start overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                                entries.length === 1 ? 'w-full min-w-full lg:min-w-0' : 'min-w-[12.5rem] lg:min-w-0'
                            } ${
                                fillsOddLastRow ? 'lg:col-span-2' : ''
                            } ${
                                isSelected
                                    ? 'border-accent/35 bg-accent/[0.09] shadow-[0_8px_24px_-18px_rgba(15,23,42,0.45)]'
                                    : 'border-neutral-200/80 bg-white/65 hover:-translate-y-0.5 hover:border-accent/25 hover:bg-white dark:border-white/[0.08] dark:bg-neutral-900/60 dark:hover:bg-neutral-900'
                            }`}
                        >
                            {isSelected && (
                                <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-accent" />
                            )}
                            <span className="flex items-center gap-2.5">
                                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                                    isSelected
                                        ? 'bg-accent/15 text-accent-dark dark:text-accent'
                                        : 'bg-neutral-100 text-neutral-400 group-hover:text-accent dark:bg-neutral-800'
                                }`}>
                                    <MapPin className="h-3.5 w-3.5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-xs font-semibold text-primary">
                                        {entry.place}
                                    </span>
                                    <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                                        Travel Date · {formatMonthYear(entry.date)}
                                    </span>
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
