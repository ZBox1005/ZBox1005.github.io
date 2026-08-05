import { geoCircle } from 'd3-geo';
import type { LngLat } from './globe';

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function normalizeDegrees(value: number): number {
    return ((value % 360) + 360) % 360;
}

/**
 * The point on Earth where the sun is directly overhead at `date`.
 *
 * Low-precision NOAA/Almanac formulation — accurate to roughly a tenth of a
 * degree over 1950–2050, far beyond what a terminator and a light label need.
 */
export function subsolarPoint(date: Date): LngLat {
    const julianDay = date.getTime() / 86_400_000 + 2_440_587.5;
    const n = julianDay - 2_451_545.0;

    const meanLongitude = normalizeDegrees(280.460 + 0.985_647_4 * n);
    const meanAnomaly = normalizeDegrees(357.528 + 0.985_600_3 * n) * RAD;

    const eclipticLongitude =
        (meanLongitude + 1.915 * Math.sin(meanAnomaly) + 0.020 * Math.sin(2 * meanAnomaly)) * RAD;
    const obliquity = (23.439 - 0.000_000_4 * n) * RAD;

    const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude)) * DEG;
    const rightAscension =
        Math.atan2(
            Math.cos(obliquity) * Math.sin(eclipticLongitude),
            Math.cos(eclipticLongitude)
        ) * DEG;

    const siderealTime = normalizeDegrees(280.460_618_37 + 360.985_647_366_29 * n);

    let longitude = normalizeDegrees(rightAscension - siderealTime);
    if (longitude > 180) longitude -= 360;

    return [longitude, declination];
}

/** Angle of the sun above the horizon at `coord`, in degrees. Negative below. */
export function solarElevation([lng, lat]: LngLat, date: Date): number {
    const [sunLng, sunLat] = subsolarPoint(date);

    const cosZenith =
        Math.sin(lat * RAD) * Math.sin(sunLat * RAD) +
        Math.cos(lat * RAD) * Math.cos(sunLat * RAD) * Math.cos((lng - sunLng) * RAD);

    return Math.asin(Math.max(-1, Math.min(1, cosZenith))) * DEG;
}

export function isDaylight(coord: LngLat, date: Date): boolean {
    return solarElevation(coord, date) > 0;
}

/** Standard twilight bands, as printed on the dateline. */
export function lightLabel(elevation: number): string {
    if (elevation > 6) return 'DAYLIGHT';
    if (elevation > -0.833) return 'GOLDEN HOUR';
    if (elevation > -6) return 'CIVIL TWILIGHT';
    if (elevation > -12) return 'NAUTICAL TWILIGHT';
    if (elevation > -18) return 'ASTRONOMICAL TWILIGHT';
    return 'NIGHT';
}

/**
 * Two concentric caps centred on the antisolar point: the outer one covers
 * civil twilight, the inner one true night. Painted in order their alphas
 * compound, giving a soft terminator without a canvas blur.
 */
export function nightCaps(date: Date, precision = 2) {
    const [lng, lat] = subsolarPoint(date);
    const centre: LngLat = [lng + 180, -lat];

    const cap = (radius: number) =>
        geoCircle().center(centre).radius(radius).precision(precision)();

    return [cap(96), cap(90)] as const;
}
