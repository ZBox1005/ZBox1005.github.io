'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Maximize2, MoveHorizontal, X } from 'lucide-react';
import type { TravelBlock } from '@/types/page';

/** Tailwind's aspect-ratio needs a real CSS value; TOML authors write "3:2". */
function aspect(ratio: string): string {
    return ratio.includes(':') ? ratio.replace(':', ' / ') : ratio;
}

/**
 * A drop cap over two sentences looks like a mistake. Below this threshold the
 * ornament simply does not appear — graceful degradation as a code path, not a
 * style guideline.
 */
const LEDE_MIN_WORDS = 30;

function centeredScrollTarget(scroller: HTMLElement, frame: HTMLElement): number {
    const scrollerRect = scroller.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const frameCentreInContent =
        scroller.scrollLeft + (frameRect.left - scrollerRect.left) + frameRect.width / 2;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    return Math.max(0, Math.min(maxScroll, frameCentreInContent - scroller.clientWidth / 2));
}

export function ProseBlock({ text, lede }: { text: string; lede?: boolean }) {
    const wordCount = text.trim().split(/\s+/).length;
    const dropCap = lede && wordCount >= LEDE_MIN_WORDS;

    return (
        <p
            className={`font-serif text-[17px] leading-[1.75] text-neutral-700 dark:text-neutral-500 ${
                lede ? '' : 'mt-5'
            } ${
                dropCap
                    ? 'first-letter:float-left first-letter:mr-2.5 first-letter:mt-1.5 first-letter:font-serif first-letter:text-[3.6rem] first-letter:leading-[0.72] first-letter:font-bold first-letter:text-accent-dark dark:first-letter:first-letter:text-accent'
                    : ''
            }`}
        >
            {text.trim()}
        </p>
    );
}

export function QuoteBlock({ text }: { text: string }) {
    return (
        <blockquote className="my-9 border-l-2 border-accent/40 pl-5 font-serif text-[21px] leading-[1.35] text-primary sm:text-[24px]">
            {text}
        </blockquote>
    );
}

function Caption({ text }: { text: string }) {
    // "Café Hawelka — Four hours…" → the part before the em-dash is the only
    // small-caps device left on the page.
    const split = text.split('—');
    const hasLabel = split.length > 1;

    return (
        <figcaption className="mt-2.5 text-[12px] leading-snug text-neutral-500">
            {hasLabel ? (
                <>
                    <span className="uppercase tracking-[0.12em] text-neutral-600 dark:text-neutral-500">
                        {split[0].trim()}
                    </span>
                    {' — '}
                    {split.slice(1).join('—').trim()}
                </>
            ) : (
                text
            )}
        </figcaption>
    );
}

function Plate({
    src,
    alt,
    ratio,
    priority,
    className = '',
}: {
    src: string;
    alt: string;
    ratio: string;
    priority?: boolean;
    className?: string;
}) {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    return (
        <div
            className={`relative overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-black/[0.06] dark:bg-neutral-800 dark:ring-white/[0.06] ${className}`}
            style={{ aspectRatio: aspect(ratio) }}
        >
            {failed ? (
                <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    {alt || 'Photograph pending'}
                </span>
            ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={priority ? 'high' : undefined}
                    onLoad={() => setLoaded(true)}
                    onError={() => setFailed(true)}
                    className={`travel-figure h-full w-full object-cover ${loaded ? 'is-loaded' : ''}`}
                />
            )}
        </div>
    );
}

function isNearby(index: number, activeIndex: number, total: number): boolean {
    const distance = Math.abs(index - activeIndex);
    return distance <= 1 || distance >= total - 1;
}

/**
 * Keeps camera originals off the network until they are about to be seen.
 * The parent reserves the photograph's real aspect ratio, so a late request
 * never changes film geometry or the exact snap position.
 */
function ProgressiveOriginalImage({
    src,
    alt,
    priority = false,
    observe = true,
    onLoad,
    className = '',
}: {
    src: string;
    alt: string;
    priority?: boolean;
    observe?: boolean;
    onLoad?: () => void;
    className?: string;
}) {
    const imageRef = useRef<HTMLImageElement>(null);
    const [requested, setRequested] = useState(priority);
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (priority) setRequested(true);
    }, [priority]);

    useEffect(() => {
        if (requested || !observe) return;
        const image = imageRef.current;
        if (!image || typeof IntersectionObserver === 'undefined') {
            setRequested(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                setRequested(true);
                observer.disconnect();
            },
            { rootMargin: '0px 85%' }
        );
        observer.observe(image);
        return () => observer.disconnect();
    }, [observe, requested]);

    return (
        <span className="relative block h-full w-full overflow-hidden rounded-[inherit]">
            {!failed && (
                <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-neutral-100 transition-opacity duration-500 dark:bg-neutral-800 ${
                        loaded ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/[0.035]" />
                </span>
            )}
            {failed && (
                <span className="absolute inset-0 flex items-center justify-center bg-neutral-100 px-3 text-center text-[8px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:bg-neutral-800">
                    Original unavailable
                </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imageRef}
                src={requested ? src : undefined}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'low'}
                onLoad={() => {
                    setLoaded(true);
                    onLoad?.();
                }}
                onError={() => setFailed(true)}
                draggable={false}
                className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </span>
    );
}

export function GalleryBlock({
    block,
    place,
}: {
    block: Extract<TravelBlock, { kind: 'gallery' }>;
    place?: string;
}) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const leadingSpacerRef = useRef<HTMLSpanElement>(null);
    const trailingSpacerRef = useRef<HTMLSpanElement>(null);
    const lightboxFilmstripRef = useRef<HTMLDivElement>(null);
    const filmMotionTimerRef = useRef<number | null>(null);
    const filmSnapTimerRef = useRef<number | null>(null);
    const filmScrollEndHandlerRef = useRef<(() => void) | null>(null);
    const programmaticIndexRef = useRef<number | null>(null);
    const edgeSyncFrameRef = useRef<number | null>(null);
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        scrollLeft: number;
        moved: boolean;
    } | null>(null);
    const suppressClickRef = useRef(false);
    const lightboxSwipeRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
    } | null>(null);
    const [dragging, setDragging] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [filmstripOpen, setFilmstripOpen] = useState(true);
    const [filmstripPreviewIndex, setFilmstripPreviewIndex] = useState<number | null>(null);
    const [filmMoving, setFilmMoving] = useState(false);
    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    const destinationName = place || 'Journey';
    const destination = destinationName === 'Türkiye'
        ? destinationName.toLocaleUpperCase('tr-TR')
        : destinationName.toUpperCase();
    const destinationWordmark = destination.length > 5
        ? 'text-[clamp(3.6rem,8vw,6.4rem)] tracking-[0.1em]'
        : 'text-[clamp(4.8rem,11vw,8.5rem)] tracking-[0.14em]';
    const activeImage = block.images[activeIndex] || block.images[0];

    const syncEdgeSpacers = useCallback(() => {
        if (edgeSyncFrameRef.current !== null) {
            window.cancelAnimationFrame(edgeSyncFrameRef.current);
        }

        edgeSyncFrameRef.current = window.requestAnimationFrame(() => {
            const scroller = scrollerRef.current;
            const leading = leadingSpacerRef.current;
            const trailing = trailingSpacerRef.current;
            if (!scroller || !leading || !trailing) return;

            const frames = Array.from(scroller.querySelectorAll<HTMLElement>('[data-gallery-frame]'));
            const first = frames[0];
            const last = frames[frames.length - 1];
            if (!first || !last) return;

            const styles = window.getComputedStyle(scroller);
            const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
            const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
            leading.style.width = `${Math.max(0, scroller.clientWidth / 2 - paddingLeft - first.offsetWidth / 2)}px`;
            trailing.style.width = `${Math.max(0, scroller.clientWidth / 2 - paddingRight - last.offsetWidth / 2)}px`;

            // Re-center the selected frame after an image loads or the viewport
            // changes. This keeps narrow portrait frames exact at either edge.
            const active = frames[activeIndexRef.current];
            if (active) {
                scroller.scrollLeft = centeredScrollTarget(scroller, active);
            }

            edgeSyncFrameRef.current = null;
        });
    }, []);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const frames = Array.from(scroller.querySelectorAll<HTMLElement>('[data-gallery-frame]'));
        const observer = typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver(syncEdgeSpacers);

        observer?.observe(scroller);
        frames.forEach((frame) => observer?.observe(frame));
        window.addEventListener('resize', syncEdgeSpacers);
        syncEdgeSpacers();

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', syncEdgeSpacers);
            if (edgeSyncFrameRef.current !== null) {
                window.cancelAnimationFrame(edgeSyncFrameRef.current);
                edgeSyncFrameRef.current = null;
            }
        };
    }, [block.images.length, syncEdgeSpacers]);

    const cueFilmMotion = useCallback((settleDelay = 220) => {
        setFilmMoving(true);
        if (filmMotionTimerRef.current !== null) {
            window.clearTimeout(filmMotionTimerRef.current);
        }
        filmMotionTimerRef.current = window.setTimeout(() => {
            setFilmMoving(false);
            filmMotionTimerRef.current = null;
        }, settleDelay);
    }, []);

    useEffect(() => () => {
        if (filmMotionTimerRef.current !== null) {
            window.clearTimeout(filmMotionTimerRef.current);
        }
        if (filmSnapTimerRef.current !== null) {
            window.clearTimeout(filmSnapTimerRef.current);
        }
        if (filmScrollEndHandlerRef.current && scrollerRef.current) {
            scrollerRef.current.removeEventListener('scrollend', filmScrollEndHandlerRef.current);
        }
    }, []);

    const moveLightbox = useCallback((offset: -1 | 1) => {
        setLightboxIndex((current) => {
            if (current === null) return null;
            return (current + offset + block.images.length) % block.images.length;
        });
    }, [block.images.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setLightboxIndex(null);
            if (event.key === 'ArrowLeft') moveLightbox(-1);
            if (event.key === 'ArrowRight') moveLightbox(1);
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [lightboxIndex, moveLightbox]);

    useEffect(() => {
        if (lightboxIndex === null || !filmstripOpen) return;
        const thumbnail = lightboxFilmstripRef.current?.querySelector<HTMLElement>(
            `[data-lightbox-thumbnail="${lightboxIndex}"]`
        );
        thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [filmstripOpen, lightboxIndex]);

    const scrollToFrame = (index: number) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const frames = Array.from(scroller.querySelectorAll<HTMLElement>('[data-gallery-frame]'));
        if (frames.length === 0) return;
        const targetIndex = (index + frames.length) % frames.length;
        const frame = frames[targetIndex];
        if (!frame) return;

        // Cancel a previous smooth movement before calculating the next target.
        // Without this, rapid index/arrow clicks measure a moving coordinate
        // system and can leave a frame visibly off-centre.
        scroller.scrollTo({ left: scroller.scrollLeft, behavior: 'auto' });
        const target = centeredScrollTarget(scroller, frame);
        const wrapsAround = Math.abs(targetIndex - activeIndexRef.current) > 1;

        programmaticIndexRef.current = targetIndex;
        activeIndexRef.current = targetIndex;
        setActiveIndex(targetIndex);
        cueFilmMotion(wrapsAround ? 260 : 420);
        if (filmSnapTimerRef.current !== null) {
            window.clearTimeout(filmSnapTimerRef.current);
        }
        if (filmScrollEndHandlerRef.current) {
            scroller.removeEventListener('scrollend', filmScrollEndHandlerRef.current);
            filmScrollEndHandlerRef.current = null;
        }
        scroller.scrollTo({
            left: target,
            behavior: wrapsAround ? 'auto' : 'smooth',
        });

        const settleOnExactCentre = () => {
            if (programmaticIndexRef.current !== targetIndex) return;
            const currentScroller = scrollerRef.current;
            const currentFrame = currentScroller?.querySelectorAll<HTMLElement>('[data-gallery-frame]')[targetIndex];
            if (currentScroller && currentFrame) {
                if (filmScrollEndHandlerRef.current) {
                    currentScroller.removeEventListener('scrollend', filmScrollEndHandlerRef.current);
                    filmScrollEndHandlerRef.current = null;
                }
                currentScroller.scrollTo({
                    left: centeredScrollTarget(currentScroller, currentFrame),
                    behavior: 'auto',
                });
            }
            if (filmSnapTimerRef.current !== null) {
                window.clearTimeout(filmSnapTimerRef.current);
            }
            programmaticIndexRef.current = null;
            filmSnapTimerRef.current = null;
        };

        if (!wrapsAround && 'onscrollend' in scroller) {
            filmScrollEndHandlerRef.current = settleOnExactCentre;
            scroller.addEventListener('scrollend', settleOnExactCentre, { once: true });
        }
        filmSnapTimerRef.current = window.setTimeout(
            settleOnExactCentre,
            wrapsAround ? 32 : 1200
        );
    };

    const nearestFrameIndex = () => {
        const scroller = scrollerRef.current;
        if (!scroller) return 0;

        const scrollerRect = scroller.getBoundingClientRect();
        const centre = scrollerRect.left + scrollerRect.width / 2;
        const frames = Array.from(scroller.querySelectorAll<HTMLElement>('[data-gallery-frame]'));
        let nearest = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        frames.forEach((frame, index) => {
            const rect = frame.getBoundingClientRect();
            const distance = Math.abs(rect.left + rect.width / 2 - centre);
            if (distance < nearestDistance) {
                nearest = index;
                nearestDistance = distance;
            }
        });
        return nearest;
    };

    const updateActiveIndex = () => {
        cueFilmMotion();
        if (programmaticIndexRef.current !== null) return;
        const nearest = nearestFrameIndex();
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
    };

    const endDrag = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        suppressClickRef.current = drag.moved;
        window.setTimeout(() => {
            suppressClickRef.current = false;
        }, 0);
        dragRef.current = null;
        setDragging(false);

        if (drag.moved) {
            const nearest = nearestFrameIndex();
            window.requestAnimationFrame(() => scrollToFrame(nearest));
        }
    };

    return (
        <>
        <section
            className="relative isolate -mx-5 -mt-5 overflow-hidden rounded-t-[calc(2rem-1px)] px-5 pb-5 pt-5 sm:-mx-7 sm:-mt-7 sm:px-7 sm:pt-7"
            aria-label={`${place || 'Travel'} photographs`}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <AnimatePresence initial={false}>
                    <motion.img
                        key={activeImage}
                        src={activeImage}
                        alt=""
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1.02 }}
                        exit={{ opacity: 0, scale: 1.08 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute -inset-[16%] h-[132%] w-[132%] max-w-none object-cover blur-[70px] saturate-[1.35]"
                    />
                </AnimatePresence>
                <span className="absolute inset-0 bg-white/70 dark:bg-neutral-950/52" />
                <span className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/25 to-white dark:from-neutral-950/5 dark:via-neutral-950/30 dark:to-neutral-900" />
            </div>

            <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                    opacity: filmMoving ? 1 : 0,
                    y: filmMoving ? 0 : 8,
                }}
                transition={{ duration: filmMoving ? 0.2 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-none absolute left-1/2 top-10 z-20 -translate-x-1/2 whitespace-nowrap font-serif font-bold leading-none text-white/[0.18] drop-shadow-[0_2px_24px_rgba(0,0,0,0.16)] ${destinationWordmark}`}
            >
                {destination}
            </motion.span>

            <div className="relative z-30 mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                    <MoveHorizontal className="h-3.5 w-3.5 text-accent" />
                    Drag the film
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tabular-nums text-neutral-400">
                        FRAME {String(activeIndex + 1).padStart(2, '0')} / {String(block.images.length).padStart(2, '0')}
                    </span>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => scrollToFrame(activeIndexRef.current - 1)}
                            aria-label="Previous photographs"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-accent/35 hover:text-accent dark:border-white/10"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollToFrame(activeIndexRef.current + 1)}
                            aria-label="Next photographs"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-accent/35 hover:text-accent dark:border-white/10"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={scrollerRef}
                onScroll={updateActiveIndex}
                onPointerDown={(event) => {
                    if (event.pointerType !== 'mouse' || event.button !== 0) return;
                    if (filmSnapTimerRef.current !== null) {
                        window.clearTimeout(filmSnapTimerRef.current);
                        filmSnapTimerRef.current = null;
                    }
                    if (filmScrollEndHandlerRef.current) {
                        event.currentTarget.removeEventListener('scrollend', filmScrollEndHandlerRef.current);
                        filmScrollEndHandlerRef.current = null;
                    }
                    programmaticIndexRef.current = null;
                    event.currentTarget.scrollTo({ left: event.currentTarget.scrollLeft, behavior: 'auto' });
                    dragRef.current = {
                        pointerId: event.pointerId,
                        startX: event.clientX,
                        scrollLeft: event.currentTarget.scrollLeft,
                        moved: false,
                    };
                    setDragging(true);
                }}
                onWheel={() => {
                    if (filmSnapTimerRef.current !== null) {
                        window.clearTimeout(filmSnapTimerRef.current);
                        filmSnapTimerRef.current = null;
                    }
                    if (filmScrollEndHandlerRef.current && scrollerRef.current) {
                        scrollerRef.current.removeEventListener('scrollend', filmScrollEndHandlerRef.current);
                        filmScrollEndHandlerRef.current = null;
                    }
                    programmaticIndexRef.current = null;
                }}
                onPointerMove={(event) => {
                    const drag = dragRef.current;
                    if (!drag || drag.pointerId !== event.pointerId) return;
                    if (Math.abs(event.clientX - drag.startX) > 5 && !drag.moved) {
                        drag.moved = true;
                        cueFilmMotion(500);
                        event.currentTarget.setPointerCapture(event.pointerId);
                    }
                    if (drag.moved) cueFilmMotion(500);
                    event.currentTarget.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
                }}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={`relative z-10 -mx-5 flex snap-x snap-proximity select-none gap-3 overflow-x-auto px-5 pb-4 sm:-mx-7 sm:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    dragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
            >
                <span
                    ref={leadingSpacerRef}
                    aria-hidden="true"
                    className="w-[clamp(1.25rem,6vw,6rem)] flex-none"
                />
                {block.images.map((src, index) => {
                    const priority = isNearby(index, activeIndex, block.images.length);
                    return (
                    <figure
                        key={src}
                        data-gallery-frame
                        className="h-[14rem] flex-none snap-center sm:h-[20rem] lg:h-[24rem]"
                        style={{ aspectRatio: aspect(block.ratios?.[index] || '3:2') }}
                    >
                        <button
                            type="button"
                            aria-label={`Open photograph ${index + 1} of ${block.images.length}`}
                            onClick={() => {
                                if (suppressClickRef.current) return;
                                setFilmstripOpen(true);
                                setLightboxIndex(index);
                            }}
                            className={`group relative block h-full w-full cursor-zoom-in rounded-xl transition-[opacity,filter,transform] duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                                index === activeIndex
                                    ? 'scale-100 opacity-100 saturate-100'
                                    : 'scale-[0.955] opacity-50 saturate-[0.72] brightness-[0.9] hover:opacity-80 hover:saturate-100 dark:brightness-[0.72]'
                            }`}
                        >
                            <ProgressiveOriginalImage
                                src={src}
                                alt={block.alts?.[index] || ''}
                                priority={priority}
                                onLoad={syncEdgeSpacers}
                                className="block h-full w-full rounded-xl object-contain ring-1 ring-black/[0.06] dark:ring-white/[0.08]"
                            />
                            <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                <Maximize2 className="h-3.5 w-3.5" />
                            </span>
                            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/85 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                View {String(index + 1).padStart(2, '0')}
                            </span>
                        </button>
                    </figure>
                    );
                })}
                <span
                    ref={trailingSpacerRef}
                    aria-hidden="true"
                    className="w-[clamp(1.25rem,6vw,6rem)] flex-none"
                />
            </div>

            <div className="relative z-10 flex gap-1.5 px-1" role="group" aria-label="Select a photograph">
                {block.images.map((src, index) => (
                    <button
                        key={src}
                        type="button"
                        onClick={() => scrollToFrame(index)}
                        aria-label={`Go to photograph ${index + 1}`}
                        aria-current={index === activeIndex ? 'true' : undefined}
                        className="group relative h-3 flex-1"
                    >
                        <span
                            className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rounded-full transition-all duration-300 ${
                                index === activeIndex
                                    ? 'h-0.5 bg-accent shadow-[0_0_12px_rgba(212,165,98,0.65)]'
                                    : 'bg-primary/15 group-hover:bg-accent/45 dark:bg-white/15'
                            }`}
                        />
                    </button>
                ))}
            </div>
        </section>
        {lightboxIndex !== null && typeof document !== 'undefined' &&
            createPortal(
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Photograph ${lightboxIndex + 1} of ${block.images.length}`}
                    className="fixed inset-0 z-[1000] bg-black text-white"
                >
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 sm:px-7 sm:py-6">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                                Original photograph
                            </p>
                            <p className="mt-1 font-mono text-xs tabular-nums text-white/80">
                                {place || 'Journey'} · {String(lightboxIndex + 1).padStart(2, '0')} / {String(block.images.length).padStart(2, '0')}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLightboxIndex(null)}
                            aria-label="Close full-screen photograph"
                            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/75 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => moveLightbox(-1)}
                        aria-label="Previous photograph"
                        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur transition-colors hover:bg-white/10 hover:text-white sm:left-7"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div
                        className={`absolute inset-0 flex touch-none items-center justify-center px-5 pt-20 transition-[padding] duration-300 sm:px-20 sm:pt-20 ${
                            filmstripOpen ? 'pb-36 sm:pb-40' : 'pb-20 sm:pb-20'
                        }`}
                        onClick={(event) => {
                            if (event.target === event.currentTarget) setLightboxIndex(null);
                        }}
                        onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            lightboxSwipeRef.current = {
                                pointerId: event.pointerId,
                                startX: event.clientX,
                                startY: event.clientY,
                            };
                        }}
                        onPointerUp={(event) => {
                            const swipe = lightboxSwipeRef.current;
                            if (!swipe || swipe.pointerId !== event.pointerId) return;
                            const dx = event.clientX - swipe.startX;
                            const dy = event.clientY - swipe.startY;
                            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
                                moveLightbox(dx < 0 ? 1 : -1);
                            }
                            lightboxSwipeRef.current = null;
                        }}
                        onPointerCancel={() => {
                            lightboxSwipeRef.current = null;
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                                key={block.images[lightboxIndex]}
                                src={block.images[lightboxIndex]}
                                alt={block.alts?.[lightboxIndex] || ''}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                draggable={false}
                                initial={{ opacity: 0, scale: 0.985 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.99 }}
                                transition={{ duration: 0.24, ease: 'easeOut' }}
                                className="max-h-full max-w-full select-none object-contain"
                            />
                        </AnimatePresence>
                    </div>

                    <button
                        type="button"
                        onClick={() => moveLightbox(1)}
                        aria-label="Next photograph"
                        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur transition-colors hover:bg-white/10 hover:text-white sm:right-7"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <div
                        className={`absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/70 px-3 pb-3 pt-2 backdrop-blur-xl transition-transform duration-300 sm:px-6 ${
                            filmstripOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.75rem)]'
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => setFilmstripOpen((open) => !open)}
                            aria-expanded={filmstripOpen}
                            className="mx-auto flex h-8 items-center gap-2 rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
                        >
                            Filmstrip
                            <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-300 ${filmstripOpen ? '' : 'rotate-180'}`}
                            />
                        </button>

                        <div
                            ref={lightboxFilmstripRef}
                            className="mx-auto flex max-w-4xl gap-2 overflow-x-auto px-[45%] pb-1 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {block.images.map((src, index) => (
                                <button
                                    key={src}
                                    type="button"
                                    data-lightbox-thumbnail={index}
                                    onClick={() => setLightboxIndex(index)}
                                    onMouseEnter={() => setFilmstripPreviewIndex(index)}
                                    onFocus={() => setFilmstripPreviewIndex(index)}
                                    aria-label={`View photograph ${index + 1}`}
                                    aria-current={index === lightboxIndex ? 'true' : undefined}
                                    className={`relative h-12 flex-none overflow-hidden rounded-md bg-white/[0.04] p-0.5 transition-all duration-300 sm:h-14 ${
                                        index === lightboxIndex
                                            ? 'opacity-100 ring-1 ring-accent shadow-[0_0_20px_rgba(212,165,98,0.22)]'
                                            : 'opacity-40 ring-1 ring-white/10 hover:opacity-80'
                                    }`}
                                    style={{ aspectRatio: aspect(block.ratios?.[index] || '3:2') }}
                                >
                                    <ProgressiveOriginalImage
                                        src={src}
                                        alt=""
                                        priority={
                                            isNearby(index, lightboxIndex, block.images.length) ||
                                            filmstripPreviewIndex === index
                                        }
                                        observe={false}
                                        className="block h-full w-full rounded-[3px] object-cover"
                                    />
                                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[8px] text-white/25 mix-blend-difference">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export function FigureBlock({
    block,
    priority,
}: {
    block: Extract<TravelBlock, { kind: 'figure' }>;
    priority?: boolean;
}) {
    const layout = block.layout || 'full';
    const alt = block.alt || '';

    if (layout === 'pair' && block.images.length > 1) {
        return (
            <figure className="my-8">
                <div className="sm:flex sm:gap-3">
                    <Plate
                        src={block.images[0]}
                        alt={alt}
                        ratio={block.ratio}
                        priority={priority}
                        className="sm:w-[60%]"
                    />
                    <Plate
                        src={block.images[1]}
                        alt={alt}
                        ratio={block.ratio}
                        className="ml-auto mt-3 w-[78%] sm:mt-0 sm:w-[40%]"
                    />
                </div>
                {block.caption && <Caption text={block.caption} />}
            </figure>
        );
    }

    return (
        <figure className={`my-8 ${layout === 'wide' ? 'lg:col-span-2' : ''}`}>
            <Plate src={block.images[0]} alt={alt} ratio={block.ratio} priority={priority} />
            {block.caption && <Caption text={block.caption} />}
        </figure>
    );
}

/** Renders an entry's blocks, dropping any quote after the first. */
export function Blocks({ blocks, place }: { blocks: TravelBlock[]; place?: string }) {
    let quotesSeen = 0;
    let figuresSeen = 0;

    return (
        <>
            {blocks.map((block, index) => {
                if (block.kind === 'prose') {
                    return <ProseBlock key={index} text={block.text} lede={block.lede} />;
                }
                if (block.kind === 'quote') {
                    quotesSeen += 1;
                    if (quotesSeen > 1) return null;
                    return <QuoteBlock key={index} text={block.text} />;
                }
                if (block.kind === 'gallery') {
                    return <GalleryBlock key={index} block={block} place={place} />;
                }
                if (block.kind === 'figure') {
                    figuresSeen += 1;
                    return <FigureBlock key={index} block={block} priority={figuresSeen === 1} />;
                }
                return null;
            })}
        </>
    );
}
