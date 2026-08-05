import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';

/**
 * The 1:110m land silhouette, fetched rather than bundled — it is ~110 KB of
 * TopoJSON that only this page needs, and the globe paints its sphere,
 * graticule and markers immediately while it is in flight.
 *
 * The promise is cached at module scope so remounts and the mobile seals all
 * share one request.
 */
let cached: Promise<FeatureCollection<Geometry>> | null = null;

export function loadLand(): Promise<FeatureCollection<Geometry>> {
    if (cached) return cached;

    cached = fetch('/geo/land-110m.json')
        .then((response) => {
            if (!response.ok) throw new Error(`land-110m.json → ${response.status}`);
            return response.json();
        })
        .then((topology) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const topo = topology as any;
            return feature(topo, topo.objects.land) as unknown as FeatureCollection<Geometry>;
        })
        .catch((error) => {
            // A globe without coastlines still reads as a globe — degrade, don't blank.
            console.error('[travel] land geometry failed to load', error);
            cached = null;
            return { type: 'FeatureCollection', features: [] } as FeatureCollection<Geometry>;
        });

    return cached;
}
