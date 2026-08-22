import type { Coord } from '@/types/page';

const MONTHS_SHORT = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const COMPASS_16 = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

const COMPASS_WORDS: Record<string, string> = {
    N: 'NORTH', NNE: 'NORTH-NORTHEAST', NE: 'NORTHEAST', ENE: 'EAST-NORTHEAST',
    E: 'EAST', ESE: 'EAST-SOUTHEAST', SE: 'SOUTHEAST', SSE: 'SOUTH-SOUTHEAST',
    S: 'SOUTH', SSW: 'SOUTH-SOUTHWEST', SW: 'SOUTHWEST', WSW: 'WEST-SOUTHWEST',
    W: 'WEST', WNW: 'WEST-NORTHWEST', NW: 'NORTHWEST', NNW: 'NORTH-NORTHWEST',
};

/** "48.21°N 16.37°E" */
export function formatCoord([lng, lat]: Coord): string {
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}°${ns} ${Math.abs(lng).toFixed(2)}°${ew}`;
}

/** "24 JUL 2024" */
export function formatDate(iso: string): string {
    const [year, month, day] = iso.split('-');
    return `${Number(day)} ${MONTHS_SHORT[Number(month) - 1]} ${year}`;
}

/** "JUL 2025" — useful when an entry represents a multi-day journey. */
export function formatMonthYear(iso: string): string {
    const [year, month] = iso.split('-');
    return `${MONTHS_SHORT[Number(month) - 1]} ${year}`;
}

/** "6,836 KM" */
export function formatKm(km: number): string {
    return `${Math.round(km).toLocaleString('en-US')} KM`;
}

/** "049°" — always three digits, as on an instrument. */
export function formatBearing(deg: number): string {
    return `${String(Math.round(deg) % 360).padStart(3, '0')}°`;
}

export function compass16(deg: number): string {
    return COMPASS_16[Math.round(((deg % 360) + 360) % 360 / 22.5) % 16];
}

/** "NORTHEAST" — the spelled-out form used in the NEXT rule. */
export function compassWord(deg: number): string {
    return COMPASS_WORDS[compass16(deg)];
}

export function yearOf(iso: string): string {
    return iso.slice(0, 4);
}
