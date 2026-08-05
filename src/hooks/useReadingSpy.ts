'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const READING_LINE = 0.4;
const SEEK_TIMEOUT_MS = 1200;

/**
 * Scroll owns which entry is active.
 *
 * Deliberately not an IntersectionObserver: an activation *band* can be
 * tunnelled by a fast flick, leaving the globe stranded on an entry that is no
 * longer on screen. Comparing cached absolute offsets against a reading line
 * cannot miss.
 */
export function useReadingSpy(ids: string[]) {
    const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

    const nodesRef = useRef<Map<string, HTMLElement>>(new Map());
    const offsetsRef = useRef<{ id: string; top: number }[]>([]);
    const seekRef = useRef<string | null>(null);
    const seekTimerRef = useRef<number | null>(null);
    const frameRef = useRef(0);
    const queuedRef = useRef(false);

    const register = useCallback((id: string, node: HTMLElement | null) => {
        if (node) nodesRef.current.set(id, node);
        else nodesRef.current.delete(id);
    }, []);

    const measure = useCallback(() => {
        const offsets: { id: string; top: number }[] = [];
        ids.forEach((id) => {
            const node = nodesRef.current.get(id);
            if (node) offsets.push({ id, top: node.getBoundingClientRect().top + window.scrollY });
        });
        offsets.sort((a, b) => a.top - b.top);
        offsetsRef.current = offsets;
    }, [ids]);

    const clearSeek = useCallback(() => {
        seekRef.current = null;
        if (seekTimerRef.current) {
            window.clearTimeout(seekTimerRef.current);
            seekTimerRef.current = null;
        }
    }, []);

    const evaluate = useCallback(() => {
        queuedRef.current = false;
        const offsets = offsetsRef.current;
        if (offsets.length === 0) return;

        const line = window.scrollY + window.innerHeight * READING_LINE;

        let readingId = offsets[0].id;
        for (const entry of offsets) {
            if (entry.top <= line) readingId = entry.id;
            else break;
        }

        // While seeking, the destination wins — so a smooth scroll that passes
        // three entries still produces exactly one globe flight.
        if (seekRef.current) {
            if (seekRef.current === readingId) clearSeek();
            else {
                setActiveId(seekRef.current);
                return;
            }
        }

        setActiveId((current) => (current === readingId ? current : readingId));
    }, [clearSeek]);

    const onScroll = useCallback(() => {
        if (queuedRef.current) return;
        queuedRef.current = true;
        frameRef.current = requestAnimationFrame(evaluate);
    }, [evaluate]);

    useEffect(() => {
        measure();
        evaluate();

        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => { measure(); evaluate(); }, 100);
        };

        // Images landing changes every offset below them.
        const onLoad = (event: Event) => {
            if ((event.target as HTMLElement)?.tagName === 'IMG') onResize();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        document.addEventListener('load', onLoad, true);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('load', onLoad, true);
            window.clearTimeout(resizeTimer);
            cancelAnimationFrame(frameRef.current);
        };
    }, [measure, evaluate, onScroll]);

    /* Any real user input abandons an in-flight seek. */
    useEffect(() => {
        const interrupt = () => { if (seekRef.current) clearSeek(); };
        window.addEventListener('wheel', interrupt, { passive: true });
        window.addEventListener('touchstart', interrupt, { passive: true });
        window.addEventListener('keydown', interrupt);
        return () => {
            window.removeEventListener('wheel', interrupt);
            window.removeEventListener('touchstart', interrupt);
            window.removeEventListener('keydown', interrupt);
        };
    }, [clearSeek]);

    const seekTo = useCallback((id: string) => {
        const node = nodesRef.current.get(id);
        if (!node) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        seekRef.current = id;
        setActiveId(id);

        if (seekTimerRef.current) window.clearTimeout(seekTimerRef.current);
        seekTimerRef.current = window.setTimeout(clearSeek, SEEK_TIMEOUT_MS);

        node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, [clearSeek]);

    useEffect(() => () => {
        if (seekTimerRef.current) window.clearTimeout(seekTimerRef.current);
    }, []);

    return { activeId, register, seekTo, remeasure: measure };
}
