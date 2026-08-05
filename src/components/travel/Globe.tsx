'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FeatureCollection, Geometry } from 'geojson';
import { geoInterpolate } from 'd3-geo';
import {
    clamp,
    createProjection,
    easeInOutCubic,
    easeOutCubic,
    easeOutExpo,
    flightDuration,
    globeRadius,
    greatCircleKm,
    MAX_PITCH,
    rotationFor,
    type LngLat,
    type Rotation,
} from '@/lib/travel/globe';
import { loadLand } from '@/lib/travel/land';
import { DARK, LIGHT, paint, type PaintMarker } from '@/lib/travel/paint';

interface GlobeProps {
    markers: PaintMarker[];
    /** Index of the entry currently under the reading line. -1 before any. */
    activeIndex: number;
    home?: LngLat | null;
    homeLabel?: string;
    onSelect?: (index: number) => void;
    initialRotation?: Rotation;
    driftDegPerSec?: number;
    graticuleStep?: number;
    interactive?: boolean;
    showLabels?: boolean;
    className?: string;
    ariaLabel?: string;
}

const RETURN_MS = 900;
const PROMOTE_MS = 260;
const PING_MS = 700;
const ARC_DELAY_MS = 180;
const ARC_MS = 800;
const HIT_RADIUS = 14;

interface Flight {
    from: LngLat;
    to: LngLat;
    start: number;
    duration: number;
}

export default function Globe({
    markers,
    activeIndex,
    home = null,
    homeLabel = 'HOME',
    onSelect,
    initialRotation = [-40, 25],
    driftDegPerSec = 1.2,
    graticuleStep = 15,
    interactive = true,
    showLabels = true,
    className = '',
    ariaLabel,
}: GlobeProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [size, setSize] = useState({ width: 0, height: 0 });
    const [isDark, setIsDark] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [land, setLand] = useState<FeatureCollection<Geometry> | null>(null);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [isDragging, setIsDragging] = useState(false);

    /* Everything animated lives in refs — the rAF loop never touches React. */
    const rotationRef = useRef<Rotation>(initialRotation);
    const flightRef = useRef<Flight | null>(null);
    const arcRevealRef = useRef(0);
    const promoteRef = useRef(0);
    const pingRef = useRef<number | null>(null);
    const pingStartRef = useRef(0);
    const seenMaxRef = useRef(-1);
    const driftingRef = useRef(true);
    const draggingRef = useRef(false);
    const dragOriginRef = useRef<{ x: number; y: number; rotation: Rotation } | null>(null);
    const movedRef = useRef(false);
    const returnRef = useRef<{ from: Rotation; to: Rotation; start: number } | null>(null);

    const rafRef = useRef(0);
    const dragFrameRef = useRef(0);
    const lastFrameRef = useRef(0);

    const palette = isDark ? DARK : LIGHT;
    const radius = useMemo(() => globeRadius(size.width, size.height), [size.width, size.height]);

    /* The loop reads the latest props through a ref, so it never goes stale. */
    const stateRef = useRef({
        markers, activeIndex, home, homeLabel, palette, land,
        graticuleStep, showLabels, size, radius, reduceMotion, driftDegPerSec, hoverIndex,
    });
    stateRef.current = {
        markers, activeIndex, home, homeLabel, palette, land,
        graticuleStep, showLabels, size, radius, reduceMotion, driftDegPerSec, hoverIndex,
    };

    /* ------------------------------------------------------------- measure */
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            const rect = entries[0]?.contentRect;
            if (rect) setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
        });
        observer.observe(el);
        setSize({ width: el.clientWidth, height: el.clientHeight });

        return () => observer.disconnect();
    }, []);

    /* --------------------------------------------------------------- theme */
    useEffect(() => {
        const read = () => setIsDark(document.documentElement.classList.contains('dark'));
        read();

        const observer = new MutationObserver(read);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const readMotion = () => setReduceMotion(mq.matches);
        readMotion();
        mq.addEventListener('change', readMotion);

        return () => {
            observer.disconnect();
            mq.removeEventListener('change', readMotion);
        };
    }, []);

    /* ---------------------------------------------------------------- land */
    useEffect(() => {
        let alive = true;
        loadLand().then((data) => { if (alive) setLand(data); });
        return () => { alive = false; };
    }, []);

    /* ------------------------------------------------------------- painter */
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        const s = stateRef.current;
        if (!canvas || !s.size.width || !s.size.height) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (canvas.width !== s.size.width * dpr || canvas.height !== s.size.height * dpr) {
            canvas.width = s.size.width * dpr;
            canvas.height = s.size.height * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        paint(ctx, {
            projection: createProjection({
                width: s.size.width,
                height: s.size.height,
                rotation: rotationRef.current,
            }),
            palette: s.palette,
            width: s.size.width,
            height: s.size.height,
            land: s.land,
            markers: s.markers,
            activeIndex: s.activeIndex,
            hoverIndex: s.hoverIndex,
            arcReveal: arcRevealRef.current,
            seenMax: seenMaxRef.current,
            home: s.home,
            homeLabel: s.homeLabel,
            dragging: draggingRef.current,
            promote: promoteRef.current,
            ping: pingRef.current,
            graticuleStep: s.graticuleStep,
            showLabels: s.showLabels,
        });
    }, []);

    /* ---------------------------------------------------------------- loop */
    const frame = useCallback((now: number) => {
      try {
        const s = stateRef.current;
        const dt = Math.min(now - lastFrameRef.current, 64);
        lastFrameRef.current = now;
        let busy = false;

        const flight = flightRef.current;
        if (flight) {
            const elapsed = now - flight.start;
            const t = clamp(elapsed / flight.duration, 0, 1);
            const eased = easeOutExpo(t);

            const point = geoInterpolate(flight.from, flight.to)(eased) as LngLat;
            rotationRef.current = rotationFor(point);
            arcRevealRef.current = clamp((elapsed - ARC_DELAY_MS) / ARC_MS, 0, 1);

            if (t >= 1) {
                flightRef.current = null;
                pingRef.current = 0;
                pingStartRef.current = now;
            }
            busy = true;
        } else if (returnRef.current) {
            const r = returnRef.current;
            const t = clamp((now - r.start) / RETURN_MS, 0, 1);
            const eased = easeInOutCubic(t);
            rotationRef.current = [
                r.from[0] + (r.to[0] - r.from[0]) * eased,
                r.from[1] + (r.to[1] - r.from[1]) * eased,
            ];
            if (t >= 1) returnRef.current = null;
            busy = true;
        } else if (
            driftingRef.current &&
            !s.reduceMotion &&
            !draggingRef.current &&
            s.driftDegPerSec > 0
        ) {
            rotationRef.current = [
                rotationRef.current[0] + (s.driftDegPerSec * dt) / 1000,
                rotationRef.current[1],
            ];
            busy = true;
        }

        // Marker promote / arc reveal settle
        if (s.activeIndex >= 0 && promoteRef.current < 1) {
            promoteRef.current = clamp(promoteRef.current + dt / PROMOTE_MS, 0, 1);
            busy = true;
        }
        if (!flight && arcRevealRef.current < 1 && s.activeIndex >= 0) {
            arcRevealRef.current = clamp(arcRevealRef.current + dt / ARC_MS, 0, 1);
            busy = true;
        }

        // Arrival ping — once, never repeating
        if (pingRef.current !== null) {
            const t = clamp((now - pingStartRef.current) / PING_MS, 0, 1);
            pingRef.current = easeOutCubic(t);
            if (t >= 1) pingRef.current = null;
            busy = true;
        }

        render();

        // Dragging is painted on its own schedule, so the loop can park during it.
        if (busy) rafRef.current = requestAnimationFrame(frame);
      } catch (error) {
        console.error('[travel] globe frame failed', error);
      }
    }, [render]);

    /**
     * Idempotent: always cancels any pending frame before scheduling a new one.
     * An earlier version guarded with an `isRunning` flag, which could wedge
     * permanently if a frame ever threw — leaving the globe unresponsive.
     */
    const wake = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        lastFrameRef.current = performance.now();
        rafRef.current = requestAnimationFrame(frame);
    }, [frame]);

    /* Repaint (and wake) whenever anything visual changes. */
    useEffect(() => {
        if (!size.width) return;
        render();
        wake();
    }, [size.width, size.height, land, palette, hoverIndex, render, wake]);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    /* ------------------------------------------------------------- fly-to */
    useEffect(() => {
        if (activeIndex < 0 || !markers[activeIndex]) return;

        driftingRef.current = false;
        seenMaxRef.current = Math.max(seenMaxRef.current, activeIndex);
        promoteRef.current = 0;

        const target = markers[activeIndex].coord;
        const rotate = rotationRef.current;
        const current: LngLat = [-rotate[0], -rotate[1]];
        if (reduceMotion) {
            rotationRef.current = rotationFor(target);
            arcRevealRef.current = 1;
            promoteRef.current = 1;
            flightRef.current = null;
            render();
            return;
        }

        returnRef.current = null;
        arcRevealRef.current = 0;
        flightRef.current = {
            from: current,
            to: target,
            start: performance.now(),
            duration: flightDuration(greatCircleKm(current, target)),
        };
        wake();
    }, [activeIndex, markers, reduceMotion, render, wake]);

    /* --------------------------------------------------------------- drag */
    const hitTest = useCallback((clientX: number, clientY: number): number => {
        const canvas = canvasRef.current;
        const s = stateRef.current;
        if (!canvas || !s.size.width) return -1;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const projection = createProjection({
            width: s.size.width,
            height: s.size.height,
            rotation: rotationRef.current,
        });
        const rotate = projection.rotate();
        const centre: LngLat = [-rotate[0], -rotate[1]];

        let best = -1;
        let bestDistance = HIT_RADIUS;

        s.markers.forEach((marker, index) => {
            const point = projection(marker.coord);
            if (!point) return;
            // Skip the far hemisphere — it projects to the same disc
            const cos =
                Math.sin(marker.coord[1] * Math.PI / 180) * Math.sin(centre[1] * Math.PI / 180) +
                Math.cos(marker.coord[1] * Math.PI / 180) * Math.cos(centre[1] * Math.PI / 180) *
                Math.cos((marker.coord[0] - centre[0]) * Math.PI / 180);
            if (cos <= 0) return;

            const distance = Math.hypot(point[0] - x, point[1] - y);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = index;
            }
        });

        return best;
    }, []);

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        if (!interactive) return;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

        draggingRef.current = true;
        setIsDragging(true);
        movedRef.current = false;
        flightRef.current = null;
        returnRef.current = null;

        dragOriginRef.current = {
            x: event.clientX,
            y: event.clientY,
            rotation: rotationRef.current,
        };
        wake();
    }, [interactive, wake]);

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        if (!interactive) return;

        if (!draggingRef.current) {
            const hit = hitTest(event.clientX, event.clientY);
            if (hit !== stateRef.current.hoverIndex) setHoverIndex(hit);
            return;
        }

        const origin = dragOriginRef.current;
        if (!origin) return;

        const dx = event.clientX - origin.x;
        const dy = event.clientY - origin.y;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;

        // Direct manipulation: apply immediately and repaint on our own frame,
        // rather than handing the gesture to the animation loop.
        const k = 75 / (stateRef.current.radius || 1);
        rotationRef.current = [
            origin.rotation[0] + dx * k,
            clamp(origin.rotation[1] - dy * k, -MAX_PITCH, MAX_PITCH),
        ];

        if (!dragFrameRef.current) {
            dragFrameRef.current = requestAnimationFrame(() => {
                dragFrameRef.current = 0;
                render();
            });
        }
    }, [interactive, hitTest, render]);

    const endDrag = useCallback((event: React.PointerEvent) => {
        if (!interactive) return;

        const target = event.currentTarget as HTMLElement;
        if (target.hasPointerCapture?.(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
        }
        draggingRef.current = false;
        dragOriginRef.current = null;
        setIsDragging(false);

        if (!movedRef.current) {
            const hit = hitTest(event.clientX, event.clientY);
            if (hit >= 0) { onSelect?.(hit); return; }
        }

        // Where the reader leaves the globe is where it stays. Scrolling to the
        // next entry re-centres it anyway, so an auto-return here would just
        // feel like the drag being undone.
        wake();
    }, [interactive, hitTest, onSelect, wake]);

    const label =
        ariaLabel ||
        `Globe showing ${markers.length} visited places` +
        (activeIndex >= 0 && markers[activeIndex] ? `, centred on ${markers[activeIndex].label}` : '');

    return (
        <div
            ref={wrapRef}
            className={`relative select-none ${interactive ? '' : 'pointer-events-none'} ${className}`}
            style={{
                touchAction: 'pan-y',
                cursor: interactive
                    ? isDragging ? 'grabbing' : hoverIndex >= 0 ? 'pointer' : 'grab'
                    : 'default',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={() => setHoverIndex(-1)}
        >
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={label}
                className="block h-full w-full"
            />
        </div>
    );
}
