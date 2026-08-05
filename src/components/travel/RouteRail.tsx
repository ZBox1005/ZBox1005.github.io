'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { railPositions, type DerivedEntry } from '@/lib/travel/derive';

interface RouteRailProps {
    entries: DerivedEntry[];
    activeIndex: number;
    onSelect: (id: string) => void;
    className?: string;
}

/**
 * The page's accessible control surface: real buttons, one per entry, spaced
 * by *elapsed time* rather than evenly — so a fourteen-month gap reads as
 * fourteen months of empty track.
 */
export default function RouteRail({ entries, activeIndex, onSelect, className = '' }: RouteRailProps) {
    const positions = railPositions(entries);
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const focusTick = (index: number) => {
        const clamped = Math.max(0, Math.min(entries.length - 1, index));
        buttonsRef.current[clamped]?.focus();
        onSelect(entries[clamped].id);
    };

    return (
        <div className={`relative h-[34px] ${className}`}>
            <div
                role="group"
                aria-label="Jump to entry"
                className="relative h-full"
                onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'j') {
                        event.preventDefault();
                        focusTick(activeIndex + 1);
                    } else if (event.key === 'ArrowLeft' || event.key === 'k') {
                        event.preventDefault();
                        focusTick(activeIndex - 1);
                    } else if (event.key === 'Home') {
                        event.preventDefault();
                        focusTick(0);
                    } else if (event.key === 'End') {
                        event.preventDefault();
                        focusTick(entries.length - 1);
                    }
                }}
            >
                {/* track */}
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-neutral-200 dark:bg-neutral-700" />

                {entries.map((entry, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <button
                            key={entry.id}
                            ref={(el) => { buttonsRef.current[index] = el; }}
                            type="button"
                            tabIndex={isActive || (activeIndex < 0 && index === 0) ? 0 : -1}
                            onClick={() => onSelect(entry.id)}
                            aria-label={`${entry.place}, ${entry.date}`}
                            aria-current={isActive ? 'true' : undefined}
                            className="group absolute top-0 flex h-full w-6 -translate-x-1/2 items-center justify-center focus:outline-none"
                            style={{ left: `${positions[index] * 100}%` }}
                        >
                            <span
                                className={`w-px rounded-full transition-all duration-300 ease-out ${
                                    isActive
                                        ? 'h-3.5 bg-accent'
                                        : 'h-1.5 bg-neutral-300 group-hover:h-2.5 group-hover:bg-accent/60 group-focus-visible:h-2.5 group-focus-visible:bg-accent dark:bg-neutral-600'
                                }`}
                            />
                            {isActive && (
                                <motion.span
                                    layoutId="travel-rail-active"
                                    className="absolute bottom-0 h-px w-6 bg-accent"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
