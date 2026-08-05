'use client';

import { useState } from 'react';
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

export function ProseBlock({ text, lede }: { text: string; lede?: boolean }) {
    const wordCount = text.trim().split(/\s+/).length;
    const dropCap = lede && wordCount >= LEDE_MIN_WORDS;

    return (
        <p
            className={`font-serif text-[17px] leading-[1.75] text-neutral-700 dark:text-neutral-300 ${
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
export function Blocks({ blocks }: { blocks: TravelBlock[] }) {
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
                if (block.kind === 'figure') {
                    figuresSeen += 1;
                    return <FigureBlock key={index} block={block} priority={figuresSeen === 1} />;
                }
                return null;
            })}
        </>
    );
}
