'use client';

import { useEffect, useRef, useState } from 'react';
import type { FeatureCollection, Geometry } from 'geojson';
import { createProjection, rotationFor, type LngLat } from '@/lib/travel/globe';
import { loadLand } from '@/lib/travel/land';
import { DARK, LIGHT, paint, type PaintMarker } from '@/lib/travel/paint';

interface GlobeSealProps {
    coord: LngLat;
    moment: Date;
    home?: LngLat | null;
    size?: number;
    className?: string;
}

/**
 * A small, frozen globe stamped beside an entry on narrow screens, where the
 * sticky instrument has no room. Same painter, called once — no rAF, no
 * observers. Because the light is real, the seals visibly change season as you
 * scroll down the page.
 */
export default function GlobeSeal({
    coord,
    moment,
    home = null,
    size = 72,
    className = '',
}: GlobeSealProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [land, setLand] = useState<FeatureCollection<Geometry> | null>(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        let alive = true;
        loadLand().then((data) => { if (alive) setLand(data); });
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        const read = () => setIsDark(document.documentElement.classList.contains('dark'));
        read();
        const observer = new MutationObserver(read);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const markers: PaintMarker[] = [{ coord, label: '', isDay: true }];

        paint(ctx, {
            projection: createProjection({ width: size, height: size, rotation: rotationFor(coord) }),
            palette: isDark ? DARK : LIGHT,
            width: size,
            height: size,
            land,
            markers,
            activeIndex: 0,
            hoverIndex: -1,
            moment,
            arcReveal: 1,
            seenMax: -1,
            home,
            homeLabel: '',
            dragging: false,
            promote: 0,
            ping: null,
            graticuleStep: 30,
            showLabels: false,
        });
    }, [coord, moment, home, size, land, isDark]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className={className}
            style={{ width: size, height: size }}
        />
    );
}
