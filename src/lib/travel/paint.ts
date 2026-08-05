import { geoPath, geoDistance, type GeoProjection } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';
import { graticule, greatCirclePoints, type LngLat } from './globe';
import { nightCapsAt } from './solar';

export interface Palette {
    ocean: string;
    land: string;
    landEdge: string;
    graticule: string;
    limb: string;
    nightOuter: string;
    nightInner: string;
    markerDim: string;
    markerHot: string;
    arc: string;
    text: string;
}

/**
 * Hard-coded rather than read from CSS custom properties: `--primary` and
 * `--background` invert between themes, which would render night brighter
 * than day.
 */
export const LIGHT: Palette = {
    ocean: '#eaf0f6',
    land: '#cbd5e1',
    landEdge: 'rgba(100,116,139,0.50)',
    graticule: 'rgba(100,116,139,0.14)',
    limb: 'rgba(30,41,59,0.25)',
    nightOuter: 'rgba(15,23,42,0.13)',
    nightInner: 'rgba(15,23,42,0.30)',
    markerDim: '#94a3b8',
    markerHot: '#b8914d',
    arc: '#b8914d',
    text: '#64748b',
};

export const DARK: Palette = {
    ocean: '#16233c',
    land: '#2f4266',
    landEdge: 'rgba(148,163,184,0.35)',
    graticule: 'rgba(148,163,184,0.12)',
    limb: 'rgba(148,163,184,0.28)',
    nightOuter: 'rgba(2,6,18,0.20)',
    nightInner: 'rgba(2,6,18,0.46)',
    markerDim: '#64748b',
    markerHot: '#e4b976',
    arc: '#e4b976',
    text: '#94a3b8',
};

export interface PaintMarker {
    coord: LngLat;
    label: string;
    /** Daylight at this entry's own moment — not the active one. */
    isDay: boolean;
}

export interface PaintState {
    projection: GeoProjection;
    palette: Palette;
    width: number;
    height: number;
    land: FeatureCollection<Geometry> | null;
    markers: PaintMarker[];
    /** Index into `markers`, or -1 before the first entry is active. */
    activeIndex: number;
    hoverIndex: number;
    /**
     * Where the sun stands, as a coordinate rather than an instant.
     *
     * Interpolating the *moment* between two entries would spin the terminator
     * once per day of separation — years apart means thousands of revolutions.
     * Moving the sun's position along a great circle instead travels at most
     * half a turn, however far apart the dates are.
     */
    subsolar: LngLat | null;
    /** 0–1 progressive draw of the active arc. */
    arcReveal: number;
    /** Highest entry index reached so far; earlier arcs linger as ghosts. */
    seenMax: number;
    home: LngLat | null;
    homeLabel: string;
    dragging: boolean;
    /** 0–1 marker promote animation. */
    promote: number;
    /** 0–1 arrival ping, or null when not pinging. */
    ping: number | null;
    graticuleStep: number;
    showLabels: boolean;
}

const LABEL_FONT = '600 11px ui-sans-serif, system-ui, -apple-system, sans-serif';
const HOME_FONT = '600 10px ui-sans-serif, system-ui, -apple-system, sans-serif';

function visible(projection: GeoProjection, coord: LngLat): { x: number; y: number; facing: number } | null {
    const rotate = projection.rotate();
    const centre: LngLat = [-rotate[0], -rotate[1]];
    const distance = geoDistance(coord, centre);
    if (distance >= Math.PI / 2) return null;

    const point = projection(coord);
    if (!point) return null;

    return { x: point[0], y: point[1], facing: Math.cos(distance) };
}

/**
 * Draws the entire globe. Pure — no React, no module state — so the static
 * mobile seals can call it once with the same code path as the live rail globe.
 */
export function paint(ctx: CanvasRenderingContext2D, state: PaintState): void {
    const {
        projection, palette, width, height, land, markers,
        activeIndex, hoverIndex, subsolar, arcReveal, seenMax,
        home, homeLabel, dragging, promote, ping, graticuleStep, showLabels,
    } = state;

    const path = geoPath(projection, ctx);
    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = 'round';

    /* 1 — ocean */
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = palette.ocean;
    ctx.fill();

    /* 2 — graticule (dropped while dragging, where it costs the most) */
    if (!dragging) {
        ctx.beginPath();
        path(graticule(graticuleStep));
        ctx.strokeStyle = palette.graticule;
        ctx.lineWidth = 0.6;
        ctx.stroke();
    }

    /* 3 — land */
    if (land && land.features.length > 0) {
        ctx.beginPath();
        path(land);
        ctx.fillStyle = palette.land;
        ctx.fill();
        ctx.strokeStyle = palette.landEdge;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    /* 4 — night, as two concentric caps whose alphas compound at the core */
    if (subsolar) {
        const [outer, inner] = nightCapsAt(subsolar, dragging ? 4 : 2);

        ctx.beginPath();
        path(outer);
        ctx.fillStyle = palette.nightOuter;
        ctx.fill();

        ctx.beginPath();
        path(inner);
        ctx.fillStyle = palette.nightInner;
        ctx.fill();
    }

    /* 5 — ghost arcs: everywhere already read, faint */
    if (home && seenMax >= 0) {
        ctx.save();
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = palette.arc;
        ctx.globalAlpha = 0.14;
        ctx.lineWidth = 1;

        markers.forEach((marker, index) => {
            if (index > seenMax || index === activeIndex) return;
            ctx.beginPath();
            path({ type: 'LineString', coordinates: greatCirclePoints(home, marker.coord) });
            ctx.stroke();
        });

        ctx.restore();
    }

    /* 6 — the active arc, drawing itself out of the home tick */
    if (home && activeIndex >= 0 && markers[activeIndex] && arcReveal > 0) {
        const points = greatCirclePoints(home, markers[activeIndex].coord, 64, arcReveal);

        ctx.save();
        ctx.beginPath();
        path({ type: 'LineString', coordinates: points });
        ctx.strokeStyle = palette.arc;
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    }

    /* 7 — limb */
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.strokeStyle = palette.limb;
    ctx.lineWidth = 1;
    ctx.stroke();

    /* 8 — markers */
    markers.forEach((marker, index) => {
        const point = visible(projection, marker.coord);
        if (!point) return;

        const isActive = index === activeIndex;
        const isHover = index === hoverIndex && !isActive;
        const alpha = isActive ? 1 : isHover ? 1 : 0.25 + point.facing * 0.55;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(point.x, point.y);

        if (isActive) {
            const r = 5.2 * (0.85 + 0.15 * promote);

            if (ping !== null) {
                ctx.save();
                ctx.globalAlpha = 0.55 * (1 - ping);
                ctx.beginPath();
                ctx.arc(0, 0, 10 + 12 * ping, 0, Math.PI * 2);
                ctx.strokeStyle = palette.markerHot;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            }

            ctx.beginPath();
            ctx.arc(0, 0, r + 1.5, 0, Math.PI * 2);
            ctx.fillStyle = palette.ocean;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = palette.markerHot;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.strokeStyle = palette.markerHot;
            ctx.globalAlpha = 0.55 * alpha;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Crosshair arms extend as the marker promotes
            const arm = 11 * promote;
            if (arm > 0.5) {
                ctx.globalAlpha = 0.75 * alpha;
                ctx.beginPath();
                [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
                    ctx.moveTo(dx * 4, dy * 4);
                    ctx.lineTo(dx * (4 + arm), dy * (4 + arm));
                });
                ctx.strokeStyle = palette.markerHot;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        } else {
            const r = isHover ? 4.4 : 3.4;

            if (marker.isDay) {
                // Hollow ring — the sun was up when this was taken
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.strokeStyle = palette.markerDim;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fillStyle = palette.markerHot;
                ctx.fill();
            }
        }

        ctx.restore();
    });

    /* 9 — active label, flipping side before it runs off the disc */
    if (showLabels && activeIndex >= 0 && markers[activeIndex]) {
        const point = visible(projection, markers[activeIndex].coord);
        if (point) {
            const flip = point.x > width * 0.62;

            ctx.save();
            ctx.font = LABEL_FONT;
            (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '0.14em';
            ctx.fillStyle = palette.markerHot;
            ctx.textBaseline = 'middle';
            ctx.textAlign = flip ? 'right' : 'left';
            ctx.fillText(
                markers[activeIndex].label.toUpperCase(),
                point.x + (flip ? -16 : 16),
                point.y
            );
            ctx.restore();
        }
    }

    /* 10 — home tick */
    if (home) {
        const point = visible(projection, home);
        if (point) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = palette.text;
            ctx.lineWidth = 1;
            ctx.strokeRect(point.x - 3.5, point.y - 3.5, 7, 7);

            if (showLabels) {
                ctx.font = HOME_FONT;
                (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '0.14em';
                ctx.fillStyle = palette.text;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'left';
                ctx.fillText(homeLabel, point.x + 10, point.y);
            }
            ctx.restore();
        }
    }
}
