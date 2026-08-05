import {
    geoOrthographic,
    geoPath,
    geoDistance,
    geoGraticule,
    geoInterpolate,
    type GeoProjection,
} from 'd3-geo';

/** Globe rotation as d3 expects it: [yaw (λ), pitch (φ)]. Roll is always 0. */
export type Rotation = [number, number];

/** A point on the sphere in [longitude, latitude] degrees. */
export type LngLat = [number, number];

/**
 * Pitch is clamped so the globe never flips upside down — beyond ~±80° the
 * poles collapse and dragging feels like it loses grip.
 */
export const MAX_PITCH = 75;

export function clampPitch(phi: number): number {
    return Math.max(-MAX_PITCH, Math.min(MAX_PITCH, phi));
}

/** Normalize a longitude into (-180, 180] so interpolation always takes the short way around. */
export function normalizeLng(lng: number): number {
    let value = ((lng + 180) % 360 + 360) % 360 - 180;
    if (value === -180) value = 180;
    return value;
}

/**
 * Convert a pointer drag (in px) into a rotation delta.
 * Sensitivity scales with the projection scale so the point under the cursor
 * tracks it at roughly 1:1 regardless of globe size.
 */
export function dragToRotation(
    start: Rotation,
    dxPx: number,
    dyPx: number,
    scale: number
): Rotation {
    const k = 75 / scale;
    return [start[0] + dxPx * k, clampPitch(start[1] - dyPx * k)];
}

/** Shortest signed angular difference from `a` to `b`, in degrees. */
export function shortestAngleDelta(a: number, b: number): number {
    return ((b - a + 540) % 360) - 180;
}

/** Interpolate between two rotations along the shortest path. `t` in [0, 1]. */
export function interpolateRotation(from: Rotation, to: Rotation, t: number): Rotation {
    return [
        from[0] + shortestAngleDelta(from[0], to[0]) * t,
        from[1] + (to[1] - from[1]) * t,
    ];
}

/**
 * The rotation that brings a coordinate to the centre of the visible disc.
 * d3 rotates the world beneath a fixed camera, hence the negation.
 */
export function rotationFor([lng, lat]: LngLat): Rotation {
    return [-lng, clampPitch(-lat)];
}

/** easeInOutCubic — calm, symmetric, good for the post-drag return. */
export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** easeOutExpo — fast departure, long settle. Reads as mass. */
export function easeOutExpo(t: number): number {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

const EARTH_RADIUS_KM = 6371;

export function greatCircleKm(a: LngLat, b: LngLat): number {
    return geoDistance(a, b) * EARTH_RADIUS_KM;
}

/**
 * Longer hauls take visibly longer to fly. Clamped so a hop is still readable
 * and a polar crossing never becomes tedious.
 */
export function flightDuration(km: number): number {
    return clamp(560 + 0.055 * km, 560, 1400);
}

/** Forward azimuth from `a` to `b`, degrees clockwise from true north. */
export function initialBearing(a: LngLat, b: LngLat): number {
    const [lon1, lat1] = [a[0] * Math.PI / 180, a[1] * Math.PI / 180];
    const [lon2, lat2] = [b[0] * Math.PI / 180, b[1] * Math.PI / 180];
    const dLon = lon2 - lon1;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

/**
 * Samples along the great circle from `a` to `b`. `fraction` < 1 truncates the
 * line so it can be drawn progressively.
 */
export function greatCirclePoints(a: LngLat, b: LngLat, samples = 64, fraction = 1): LngLat[] {
    const interpolate = geoInterpolate(a, b);
    const count = Math.max(2, Math.ceil(samples * clamp(fraction, 0, 1)));
    return Array.from({ length: count }, (_, i) => interpolate(i / (samples - 1)) as LngLat);
}

export interface ProjectionOptions {
    width: number;
    height: number;
    rotation: Rotation;
    /** Fraction of the smaller viewport dimension the globe should occupy. */
    fill?: number;
}

export function createProjection({ width, height, rotation, fill = 0.845 }: ProjectionOptions): GeoProjection {
    const radius = (Math.min(width, height) / 2) * fill;
    return geoOrthographic()
        .translate([width / 2, height / 2])
        .scale(radius)
        .rotate([rotation[0], rotation[1], 0])
        .clipAngle(90);
}

export function createPath(projection: GeoProjection) {
    return geoPath(projection);
}

export function graticule(step = 15) {
    return geoGraticule().step([step, step])();
}

export interface ProjectedMarker {
    x: number;
    y: number;
    /** True when the point sits on the hemisphere facing the viewer. */
    visible: boolean;
    /**
     * 0 at the limb, 1 at the centre of the disc. Use to fade/shrink markers as
     * they rotate away so they dissolve at the edge instead of popping.
     */
    facing: number;
}

/**
 * Project a coordinate and report whether it is on the near hemisphere.
 * `projection.clipAngle(90)` hides geometry on the far side, but point
 * projection still returns coordinates there — so we test angular distance
 * from the projection centre ourselves.
 */
export function projectMarker(projection: GeoProjection, coord: LngLat): ProjectedMarker {
    const rotate = projection.rotate();
    const centre: LngLat = [-rotate[0], -rotate[1]];
    const distance = geoDistance(coord, centre);
    const visible = distance < Math.PI / 2;
    const projected = projection(coord);

    return {
        x: projected ? projected[0] : 0,
        y: projected ? projected[1] : 0,
        visible,
        facing: visible ? Math.cos(distance) : 0,
    };
}

/** Screen radius of the globe for the given viewport. */
export function globeRadius(width: number, height: number, fill = 0.845): number {
    return (Math.min(width, height) / 2) * fill;
}
