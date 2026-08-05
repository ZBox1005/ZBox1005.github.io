import { greatCircleKm, initialBearing } from './globe';
import { lightLabel, solarElevation } from './solar';
import { compassWord } from './format';
import type { Coord, TravelEntry, TravelPageConfig } from '@/types/page';

export interface DerivedEntry extends TravelEntry {
    index: number;
    /** The authored instant, resolved to UTC. */
    moment: Date;
    elevation: number;
    light: string;
    isDay: boolean;
    kmFromHome: number;
    bearingFromHome: number;
    next: { km: number; compass: string; place: string } | null;
    /** Milliseconds since epoch — used to space the route rail by real time. */
    time: number;
}

/**
 * Resolve an entry's authored wall-clock time to a real instant.
 * The offset is authored with DST already applied, because a static export
 * ships no timezone database.
 */
export function momentFor(entry: TravelEntry): Date {
    const time = entry.local_time || '12:00';
    const offset = entry.utc_offset || 'Z';
    const normalized = offset === 'Z' || /[+-]\d{2}:\d{2}/.test(offset) ? offset : 'Z';

    const parsed = new Date(`${entry.date}T${time}:00${normalized}`);
    return Number.isNaN(parsed.getTime()) ? new Date(`${entry.date}T12:00:00Z`) : parsed;
}

/**
 * Everything the page prints that the author does not write: the light at that
 * hour, the distance and bearing from home, and the leg to the next entry.
 */
export function deriveEntries(config: TravelPageConfig): DerivedEntry[] {
    const home: Coord = config.home?.coord ?? [0, 0];

    const ordered = [...(config.entries || [])].sort(
        (a, b) => momentFor(a).getTime() - momentFor(b).getTime()
    );

    return ordered.map((entry, index) => {
        const moment = momentFor(entry);
        const elevation = solarElevation(entry.coord, moment);
        const nextEntry = ordered[index + 1];

        return {
            ...entry,
            index,
            moment,
            time: moment.getTime(),
            elevation,
            light: lightLabel(elevation),
            isDay: elevation > 0,
            kmFromHome: greatCircleKm(home, entry.coord),
            bearingFromHome: initialBearing(home, entry.coord),
            next: nextEntry
                ? {
                      km: greatCircleKm(entry.coord, nextEntry.coord),
                      compass: compassWord(initialBearing(entry.coord, nextEntry.coord)),
                      place: nextEntry.place,
                  }
                : null,
        };
    });
}

export interface Census {
    entries: number;
    countries: number;
    fromYear: string;
    toYear: string;
    furthestKm: number;
}

/**
 * "British Columbia, Canada" → "Canada"; "SAR, China" → "China". Regions are
 * authored at whatever granularity reads best in the dateline, so the country
 * is the last comma-separated segment.
 */
function countryOf(entry: DerivedEntry): string {
    const region = entry.region || entry.place;
    return region.split(',').pop()!.trim();
}

export function census(entries: DerivedEntry[]): Census | null {
    if (entries.length === 0) return null;

    const countries = new Set(entries.map(countryOf));

    return {
        entries: entries.length,
        countries: countries.size,
        fromYear: entries[0].date.slice(0, 4),
        toYear: entries[entries.length - 1].date.slice(0, 4),
        furthestKm: Math.max(...entries.map((e) => e.kmFromHome)),
    };
}

/**
 * Rail tick positions as fractions of the full span, spaced by real elapsed
 * time then pushed apart so no two ticks collide. A fourteen-month gap reads
 * as fourteen months of empty track.
 */
export function railPositions(entries: DerivedEntry[], minGap = 0.035): number[] {
    if (entries.length === 0) return [];
    if (entries.length === 1) return [0.5];

    const first = entries[0].time;
    const span = entries[entries.length - 1].time - first || 1;
    const positions = entries.map((e) => (e.time - first) / span);

    // Forward pass, then clamp the tail back inside the track.
    for (let i = 1; i < positions.length; i += 1) {
        if (positions[i] - positions[i - 1] < minGap) {
            positions[i] = positions[i - 1] + minGap;
        }
    }

    const overflow = positions[positions.length - 1] - 1;
    if (overflow > 0) {
        for (let i = positions.length - 1; i >= 0; i -= 1) {
            positions[i] = Math.max(0, positions[i] - overflow);
            if (i > 0 && positions[i] - positions[i - 1] >= minGap) break;
        }
    }

    return positions;
}
